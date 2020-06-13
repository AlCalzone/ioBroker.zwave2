import * as React from "react";
import { InclusionMode } from "../../../src/lib/shared";
import type { NetworkHealPollResponse } from "../../../src/lib/shared";
import { Modal } from "../components/modal";
import { NodeActions } from "../components/nodeActions";
import type { Device } from "../lib/backend";
import { statusToCssClass, statusToIconName } from "../lib/shared";
import { DevicesContext } from "../lib/useDevices";
import { useIoBrokerState } from "../lib/useIoBrokerState";
import { NotRunning } from "../components/notRunning";
import { AdapterContext } from "../lib/useAdapter";

async function beginHealingNetwork(): Promise<void> {
	return new Promise((resolve, reject) => {
		sendTo(null, "beginHealingNetwork", null, async ({ error, result }) => {
			if (result === "ok") {
				resolve();
			} else {
				reject(error ?? result);
			}
		});
	});
}

async function stopHealingNetwork(): Promise<void> {
	return new Promise((resolve, reject) => {
		sendTo(null, "stopHealingNetwork", null, async ({ error, result }) => {
			if (result === "ok") {
				resolve();
			} else {
				reject(error ?? result);
			}
		});
	});
}

async function pollHealingStatus(): Promise<any> {
	return new Promise<any>((resolve, reject) => {
		sendTo(null, "healNetworkPoll", null, ({ error, result }) => {
			if (error) reject(error);
			resolve(result);
		});
	});
}

async function doClearCache(): Promise<void> {
	return new Promise((resolve, reject) => {
		sendTo(null, "clearCache", null, async ({ error, result }) => {
			if (result === "ok") {
				resolve();
			} else {
				reject(error ?? result);
			}
		});
	});
}

async function removeFailedNode(nodeId: number): Promise<void> {
	return new Promise((resolve, reject) => {
		sendTo(
			null,
			"removeFailedNode",
			{ nodeId },
			async ({ error, result }) => {
				if (result === "ok") {
					resolve();
				} else {
					reject(error ?? result);
				}
			},
		);
	});
}

async function refreshNodeInfo(nodeId: number): Promise<void> {
	return new Promise((resolve, reject) => {
		sendTo(
			null,
			"refreshNodeInfo",
			{ nodeId },
			async ({ error, result }) => {
				if (result === "ok") {
					resolve();
				} else {
					reject(error ?? result);
				}
			},
		);
	});
}

interface MessageProps {
	title: string;
	content: string | React.ReactNode;
	open: boolean;
	yesButtonText?: string;
	noButtonText?: string;
	hasNoButton?: boolean;
	onClose?(result: boolean): void;
}

function getDefaultMessageProps(): MessageProps {
	return { open: false, title: "", content: "" };
}

export function Devices() {
	const { devices } = React.useContext(DevicesContext);
	const { alive: adapterRunning, connected: driverReady } = React.useContext(
		AdapterContext,
	);

	const namespace = `${adapter}.${instance}`;

	const [inclusion, setInclusion] = useIoBrokerState<InclusionMode>(
		`${namespace}.info.inclusion`,
		{
			defaultValue: InclusionMode.Idle,
			transform: (value) =>
				value === false ? InclusionMode.Idle : value,
		},
	);
	const [exclusion, setExclusion] = useIoBrokerState<boolean>(
		`${namespace}.info.exclusion`,
		{
			defaultValue: false,
		},
	);
	const [healingNetwork] = useIoBrokerState<boolean>(
		`${namespace}.info.healingNetwork`,
		{
			defaultValue: false,
		},
	);

	const [message, setMessage] = React.useState<MessageProps>(
		getDefaultMessageProps(),
	);
	const [networkHealProgress, setNetworkHealProgress] = React.useState<
		NonNullable<NetworkHealPollResponse["progress"]>
	>({});
	const [cacheCleared, setCacheCleared] = React.useState(false);
	// Which "Node actions" modal is currently open
	const [curActionsModal, setCurActionsModal] = React.useState<number>();

	function hideMessage() {
		setMessage(getDefaultMessageProps());
	}

	function showMessage(
		title: string,
		content: string | React.ReactNode,
		yesButtonText?: string,
		noButtonText?: string,
	): Promise<boolean> {
		return new Promise((resolve) => {
			setMessage({
				open: true,
				title: _(title),
				content: typeof content === "string" ? _(content) : content,
				hasNoButton: !!noButtonText,
				yesButtonText: _(yesButtonText ?? "OK"),
				noButtonText: noButtonText ? _(noButtonText) : undefined,
				onClose: (result) => {
					hideMessage();
					resolve(result);
				},
			});
		});
	}

	React.useEffect(() => hideMessage(), []);

	React.useEffect(() => {
		if (adapterRunning && driverReady && inclusion === InclusionMode.Idle) {
			M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"));
		}
	}, [adapterRunning, driverReady, inclusion]);

	async function healNetwork() {
		if (!healingNetwork) {
			// start the healing progress
			try {
				setNetworkHealProgress({});
				await beginHealingNetwork();
			} catch (e) {
				void showMessage("Error", e);
				return;
			}
		}
	}

	async function clearCache() {
		if (
			!healingNetwork &&
			inclusion === InclusionMode.Idle &&
			!exclusion &&
			!cacheCleared
		) {
			// start the healing progress
			try {
				if (
					!(await showMessage(
						"Clear cache?",
						"clear cache procedure",
						"yes",
						"no",
					))
				) {
					return;
				}
				await doClearCache();
				setCacheCleared(true);
			} catch (e) {
				void showMessage("Error", e);
				return;
			}
		}
	}

	// Poll the healing progress while we're healing
	const [isPolling, setIsPolling] = React.useState(false);
	React.useEffect(() => {
		(async () => {
			if (healingNetwork && !isPolling) {
				setIsPolling(true);
				try {
					const result = await pollHealingStatus();
					setNetworkHealProgress(result.progress ?? {});
					if (result.type === "done") {
						void showMessage(
							"Done!",
							"Healing the network was successful!",
						);
					} else {
						// Kick off the next poll
						setIsPolling(false);
					}
				} catch (e) {
					console.error(`Error while polling: ${e}`);
					// Kick of the next poll
					setIsPolling(false);
				}
			}
		})();
	}, [isPolling, healingNetwork]);

	const devicesAsArray: Device[] = [];
	if (devices) {
		for (const nodeId of Object.keys(devices)) {
			const device = devices[nodeId];
			if (device) devicesAsArray.push(device);
		}
	}

	return adapterRunning && driverReady ? (
		<>
			{/* Action buttons */}
			<div id="device-controls">
				{inclusion !== InclusionMode.Idle ? (
					<a
						className={`waves-effect waves-light btn red`}
						onClick={() => setInclusion(InclusionMode.Idle)}
					>
						<i className="material-icons left">cancel</i>
						{_("Cancel inclusion")}
					</a>
				) : (
					<>
						<ul
							id="inclusion-dropdown"
							className="dropdown-content"
						>
							<li>
								<a
									onClick={() =>
										setInclusion(InclusionMode.Secure)
									}
								>
									<i className="material-icons tiny left">
										verified_user
									</i>
									{_("Secure")}
								</a>
							</li>
							<li>
								<a
									onClick={() =>
										setInclusion(InclusionMode.NonSecure)
									}
								>
									<i className="material-icons tiny left">
										no_encryption
									</i>
									{_("Non-secure")}
								</a>
							</li>
						</ul>
						<a
							className={`waves-effect waves-light btn dropdown-trigger ${
								exclusion ? "disabled" : ""
							}`}
							data-target="inclusion-dropdown"
						>
							<i className="material-icons left">add</i>
							{_("Include device")}
							<i className="material-icons right">
								arrow_drop_down
							</i>
						</a>
					</>
				)}{" "}
				{exclusion ? (
					<a
						className={`waves-effect waves-light btn red`}
						onClick={() => setExclusion(false)}
					>
						<i className="material-icons left">cancel</i>
						{_("Cancel exclusion")}
					</a>
				) : (
					<a
						className={`waves-effect waves-light btn ${
							inclusion !== InclusionMode.Idle ? "disabled" : ""
						}`}
						onClick={() => setExclusion(true)}
					>
						<i className="material-icons left">remove</i>
						{_("Exclude device")}
					</a>
				)}{" "}
				<a
					className={`waves-effect waves-light btn ${
						inclusion !== InclusionMode.Idle ||
						exclusion ||
						cacheCleared
							? "disabled"
							: ""
					}${healingNetwork ? "red" : ""}`}
					onClick={() =>
						healingNetwork ? stopHealingNetwork() : healNetwork()
					}
				>
					<i className="material-icons left">network_check</i>
					{healingNetwork ? _("Cancel healing") : _("Heal network")}
				</a>{" "}
				<a
					className={`waves-effect waves-light btn ${
						healingNetwork ||
						inclusion !== InclusionMode.Idle ||
						exclusion ||
						cacheCleared
							? "disabled"
							: ""
					}`}
					onClick={() => clearCache()}
				>
					<i className="material-icons left">restore_page</i>
					{_("Clear cache")}
				</a>
			</div>
			<div className="divider"></div>

			{/* The node table starts here */}
			<table>
				<thead>
					<tr>
						<td>#</td>
						<td>{_("Name")}</td>
						<td>{_("Type")}</td>
						<td>{_("Status")}</td>
						<td>{_("Header_Actions")}</td>
					</tr>
				</thead>
				<tbody>
					{devicesAsArray.length ? (
						devicesAsArray.map(({ value, status }) => {
							const nodeId = value.native.id as number;

							const nodeHealStatus = networkHealProgress[nodeId];
							let healIconCssClass: string;
							let healIconTooltip: string;
							let healIconName: string;
							switch (nodeHealStatus) {
								case "done":
									healIconCssClass =
										"green-text text-darken-4";
									healIconTooltip = "done";
									healIconName = "done";
									break;
								case "skipped":
									healIconCssClass =
										"orange-text text-darken-3";
									healIconTooltip = "skipped";
									healIconName = "redo";
									break;
								case "failed":
									healIconCssClass = "red-text text-darken-4";
									healIconTooltip = "failed";
									healIconName = "error_outline";
									break;
								case "pending":
									healIconCssClass =
										"light-blue-text text-accent-4 working";
									healIconTooltip = "pending";
									healIconName = "autorenew";
									break;
							}
							return (
								<tr key={nodeId}>
									<td>{nodeId}</td>
									<td>
										{value.native.secure === true && (
											<>
												<i
													className="material-icons tiny"
													title={_(
														"device is secure",
													)}
													style={{
														verticalAlign: "bottom",
													}}
												>
													lock_outline
												</i>
												&nbsp;
											</>
										)}
										{value.common.name}
									</td>
									<td>{(value.native as any).type.basic}</td>
									<td>
										{/* Whether the device is reachable */}
										<i
											className={`material-icons ${statusToCssClass(
												status,
											)}`}
											title={_(status ?? "unknown")}
										>
											{statusToIconName(status)}
										</i>
										{/* While healing the network also show the current progress */}
										{healingNetwork && (
											<>
												{" "}
												<i
													className={`material-icons ${healIconCssClass}`}
													title={_(healIconTooltip)}
												>
													{healIconName}
												</i>
											</>
										)}
									</td>
									<td>
										<a
											className="btn-small"
											onClick={() =>
												setCurActionsModal(nodeId)
											}
										>
											<i className="material-icons">
												more_horiz
											</i>
										</a>
										{/* Modal to edit this node */}
										<Modal
											id={`modalEditNode${nodeId}`}
											title={`Node #${nodeId}`}
											yesButtonText={_("close")}
											open={curActionsModal === nodeId}
											content={
												<NodeActions
													nodeId={nodeId}
													status={status}
													actions={{
														remove: removeFailedNode.bind(
															undefined,
															nodeId,
														),
														refreshInfo: refreshNodeInfo.bind(
															undefined,
															nodeId,
														),
													}}
													close={() =>
														setCurActionsModal(
															undefined,
														)
													}
												/>
											}
											onClose={() =>
												setCurActionsModal(undefined)
											}
										/>
									</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={5} style={{ textAlign: "center" }}>
								{_("No devices present")}
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* Modal for error messages */}
			<Modal id="messageDialog" {...message} />
		</>
	) : (
		<NotRunning />
	);
}
