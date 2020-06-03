import * as React from "react";
import type { NetworkHealPollResponse } from "../../../src/lib/shared";
import { InclusionMode } from "../../../src/lib/shared";
import { Modal } from "../components/modal";
import { useStateWithRef } from "../lib/stateWithRefs";
import { NodeActions } from "../components/nodeActions";
import {
	setStateAsync,
	getStateAsync,
	Device,
	loadDevices,
	getNodeStatus,
} from "../lib/backend";
import { statusToIconName, statusToCssClass } from "../lib/shared";

let namespace: string;

const deviceIdRegex = /Node_(\d+)$/;
const deviceStatusRegex = /Node_(\d+)\.status$/;
const inclusionRegex = /info\.inclusion$/;
const exclusionRegex = /info\.exclusion$/;
const healNetworkRegex = /info\.healingNetwork$/;

async function getInclusionStatus(): Promise<InclusionMode> {
	const ret = (await getStateAsync(`${namespace}.info.inclusion`)).val;
	if (ret === false) return InclusionMode.Idle;
	return ret as InclusionMode;
}

async function getExclusionStatus(): Promise<boolean> {
	return (await getStateAsync(`${namespace}.info.exclusion`)).val as boolean;
}

async function setInclusionStatus(status: InclusionMode): Promise<void> {
	return setStateAsync(`${namespace}.info.inclusion`, status);
}

async function setExclusionStatus(active: boolean): Promise<void> {
	return setStateAsync(`${namespace}.info.exclusion`, active);
}

async function getHealingStatus(): Promise<boolean> {
	return (await getStateAsync(`${namespace}.info.healingNetwork`))
		.val as boolean;
}

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
	// Because the useEffect callback captures stale state, we need to use a ref for all state that is required in the hook
	const [devices, devicesRef, setDevices] = useStateWithRef<
		Record<number, Device>
	>();
	const [inclusion, setInclusion] = React.useState(InclusionMode.Idle);
	const [exclusion, setExclusion] = React.useState(false);
	const [healingNetwork, setHealingNetwork] = React.useState(false);
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

	React.useEffect(() => {
		// componentDidMount
		const onObjectChange: ioBroker.ObjectChangeHandler = async (
			id,
			obj,
		) => {
			if (!id.startsWith(namespace) || !deviceIdRegex.test(id)) return;
			if (obj) {
				// New or changed device object
				if (
					obj.type === "device" &&
					typeof obj.native.id === "number"
				) {
					const nodeId = obj.native.id;
					const device: Device = {
						id,
						value: obj,
						status: await getNodeStatus(namespace, nodeId),
					};
					setDevices({ ...devicesRef.current, [nodeId]: device });
				}
			} else {
				const nodeId = parseInt(deviceIdRegex.exec(id)![1], 10);
				const newDevices = { ...devicesRef.current };
				delete newDevices[nodeId];
				setDevices(newDevices);
			}
		};

		const onStateChange: ioBroker.StateChangeHandler = async (
			id,
			state,
		) => {
			if (!id.startsWith(namespace)) return;
			if (!state || !state.ack) return;

			if (id.match(deviceStatusRegex)) {
				// A device's status was changed
				const nodeId = parseInt(deviceStatusRegex.exec(id)![1], 10);
				const updatedDevice = devicesRef.current?.[nodeId];
				if (updatedDevice) {
					updatedDevice.status = state.val as any;
					setDevices({
						...devicesRef.current,
						[nodeId]: updatedDevice,
					});
				}
			} else if (id.match(inclusionRegex)) {
				setInclusion(state.val as any);
			} else if (id.match(exclusionRegex)) {
				setExclusion(!!state.val);
			} else if (id.match(healNetworkRegex)) {
				setHealingNetwork(!!state.val);
			}
		};

		(async () => {
			namespace = `${adapter}.${instance}`;

			hideMessage();

			setDevices(
				await loadDevices(namespace, {
					status: true,
				}),
			);
			setInclusion(await getInclusionStatus());
			setExclusion(await getExclusionStatus());
			setHealingNetwork(await getHealingStatus());

			socket.on("stateChange", onStateChange);
			socket.on("objectChange", onObjectChange);
		})();

		// componentWillUnmount
		return () => {
			socket.removeEventHandler("stateChange", onStateChange);
			socket.removeEventHandler("objectChange", onObjectChange);
		};
	}, []);

	React.useEffect(() => {
		if (inclusion === InclusionMode.Idle) {
			M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"));
		}
	}, [inclusion]);

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

	return (
		<>
			{/* Action buttons */}
			<div id="device-controls">
				{inclusion !== InclusionMode.Idle ? (
					<a
						className={`waves-effect waves-light btn red`}
						onClick={() => setInclusionStatus(InclusionMode.Idle)}
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
										setInclusionStatus(InclusionMode.Secure)
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
										setInclusionStatus(
											InclusionMode.NonSecure,
										)
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
						onClick={() => setExclusionStatus(false)}
					>
						<i className="material-icons left">cancel</i>
						{_("Cancel exclusion")}
					</a>
				) : (
					<a
						className={`waves-effect waves-light btn ${
							inclusion !== InclusionMode.Idle ? "disabled" : ""
						}`}
						onClick={() => setExclusionStatus(true)}
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
	);
}
