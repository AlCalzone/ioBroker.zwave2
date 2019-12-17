import * as React from "react";
import {
	computeDeviceId,
	NetworkHealPollResponse,
} from "../../../src/lib/shared";
import { Modal } from "../components/modal";
import { useStateWithRef } from "../lib/stateWithRefs";

let namespace: string;

interface Device {
	id: string;
	value: ioBroker.DeviceObject;
	status?: "unknown" | "alive" | "asleep" | "awake" | "dead";
}

function statusToIconName(status: Device["status"]): string {
	switch (status) {
		case "alive":
		case "awake":
			return "wifi";
		case "asleep":
			return "power_settings_new";
		case "dead":
			return "wifi_off";
		default:
			return "device_unknown";
	}
}

const deviceIdRegex = /Node_(\d+)$/;
const deviceStatusRegex = /Node_(\d+)\.status$/;
const inclusionRegex = /info\.inclusion$/;
const exclusionRegex = /info\.exclusion$/;
const healNetworkRegex = /info\.healingNetwork$/;

async function loadDevices(): Promise<Record<number, Device>> {
	return new Promise((resolve, reject) => {
		// retrieve all devices
		socket.emit(
			"getObjectView",
			"system",
			"device",
			{ startkey: namespace + ".", endkey: namespace + ".\u9999" },
			async (err, devices?: { rows: Device[] }) => {
				if (err) reject(err);
				const ret = {};
				if (devices?.rows) {
					for (const device of devices.rows) {
						const nodeId = device.value.native.id;
						device.status = await getNodeStatus(nodeId);
						ret[nodeId] = device;
					}
				}
				resolve(ret);
			},
		);
	});
}

async function getNodeStatus(nodeId: number): Promise<Device["status"]> {
	return new Promise((resolve, reject) => {
		const stateId = `${namespace}.${computeDeviceId(nodeId)}.status`;
		// retrieve all devices
		socket.emit("getState", stateId, (err, state?: ioBroker.State) => {
			if (err) reject(err);
			resolve(state?.val);
		});
	});
}

async function getInclusionStatus(): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const stateId = `${namespace}.info.inclusion`;
		// retrieve all devices
		socket.emit("getState", stateId, (err, state?: ioBroker.State) => {
			if (err) reject(err);
			resolve(state?.val);
		});
	});
}

async function getExclusionStatus(): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const stateId = `${namespace}.info.exclusion`;
		// retrieve all devices
		socket.emit("getState", stateId, (err, state?: ioBroker.State) => {
			if (err) reject(err);
			resolve(state?.val);
		});
	});
}

async function setInclusionStatus(active: boolean): Promise<void> {
	return new Promise((resolve, reject) => {
		const stateId = `${namespace}.info.inclusion`;
		// retrieve all devices
		socket.emit("setState", stateId, active, (err, result) => {
			if (err) reject(err);
			resolve();
		});
	});
}

async function setExclusionStatus(active: boolean): Promise<void> {
	return new Promise((resolve, reject) => {
		const stateId = `${namespace}.info.exclusion`;
		// retrieve all devices
		socket.emit("setState", stateId, active, (err, result) => {
			if (err) reject(err);
			resolve();
		});
	});
}

async function getHealingStatus(): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const stateId = `${namespace}.info.healingNetwork`;
		// retrieve all devices
		socket.emit("getState", stateId, (err, state?: ioBroker.State) => {
			if (err) reject(err);
			resolve(state?.val);
		});
	});
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

async function subscribeObjectsAsync(pattern: string): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("subscribeObjects", pattern, async error => {
			if (error) reject(error);
			resolve();
		});
	});
}

async function subscribeStatesAsync(pattern: string): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("subscribeStates", pattern, async error => {
			if (error) reject(error);
			resolve();
		});
	});
}

interface MessageProps {
	title: string;
	content: string;
	open: boolean;
}

function getDefaultMessageProps(): MessageProps {
	return { open: false, title: "", content: "" };
}

export function Devices(props: any) {
	// Because the useEffect callback captures stale state, we need to use a ref for all state that is required in the hook
	const [devices, devicesRef, setDevices] = useStateWithRef<
		Record<number, Device>
	>();
	const [inclusion, setInclusion] = React.useState(false);
	const [exclusion, setExclusion] = React.useState(false);
	const [healingNetwork, setHealingNetwork] = React.useState(false);
	const [message, setMessage] = React.useState<MessageProps>(
		getDefaultMessageProps(),
	);
	const [networkHealProgress, setNetworkHealProgress] = React.useState<
		NonNullable<NetworkHealPollResponse["progress"]>
	>({});

	function hideMessage() {
		setMessage(getDefaultMessageProps());
	}

	function showMessage(title: string, content: string) {
		setMessage({ open: true, title, content });
	}

	React.useEffect(() => {
		// componentDidMount
		(async () => {
			namespace = `${adapter}.${instance}`;

			hideMessage();

			// subscribe to changes
			console.warn(`subscribe: ${namespace + ".*"}`);
			await subscribeObjectsAsync(namespace + ".*");
			await subscribeStatesAsync(namespace + ".*");
			// And unsubscribe when the page is unloaded
			window.addEventListener("unload", () => {
				console.warn(`unsubscribe: ${namespace + ".*"}`);
				socket.emit("unsubscribeObjects", namespace + ".*");
				socket.emit("unsubscribeStates", namespace + ".*");
			});

			setDevices(await loadDevices());
			setInclusion(await getInclusionStatus());
			setExclusion(await getExclusionStatus());
			setHealingNetwork(await getHealingStatus());

			socket.on("objectChange", async (id, obj) => {
				if (!id.startsWith(namespace) || !deviceIdRegex.test(id))
					return;
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
							status: await getNodeStatus(nodeId),
						};
						setDevices({ ...devicesRef.current, [nodeId]: device });
					}
				} else {
					const nodeId = parseInt(deviceIdRegex.exec(id)![1], 10);
					const newDevices = { ...devicesRef.current };
					delete newDevices[nodeId];
					setDevices(newDevices);
				}
			});

			socket.on("stateChange", async (id, state) => {
				if (!id.startsWith(namespace)) return;
				if (!state || !state.ack) return;

				if (id.match(deviceStatusRegex)) {
					// A device's status was changed
					const nodeId = parseInt(deviceStatusRegex.exec(id)![1], 10);
					const updatedDevice = devicesRef.current?.[nodeId];
					if (updatedDevice) {
						updatedDevice.status = state.val;
						setDevices({
							...devicesRef.current,
							[nodeId]: updatedDevice,
						});
					}
				} else if (id.match(inclusionRegex)) {
					setInclusion(!!state.val);
				} else if (id.match(exclusionRegex)) {
					setExclusion(!!state.val);
				} else if (id.match(healNetworkRegex)) {
					setHealingNetwork(!!state.val);
				}
			});
		})();
	}, []);

	async function healNetwork() {
		if (!healingNetwork) {
			// start the healing progress
			try {
				setNetworkHealProgress({});
				await beginHealingNetwork();
			} catch (e) {
				showMessage(_("Error"), e);
				return;
			}
		}
	}

	// Poll the healing progress while the dialog is visible and we're healing
	const [isPolling, setIsPolling] = React.useState(false);
	React.useEffect(() => {
		(async () => {
			if (healingNetwork && !isPolling) {
				setIsPolling(true);
				try {
					const result = await pollHealingStatus();
					setNetworkHealProgress(result.progress ?? {});
					if (result.type === "done") {
						showMessage(
							_("Done!"),
							_("Healing the network was successful!"),
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
				{inclusion ? (
					<a
						className={`waves-effect waves-light btn red`}
						onClick={() => setInclusionStatus(false)}
					>
						<i className="material-icons left">cancel</i>
						{_("Cancel inclusion")}
					</a>
				) : (
					<a
						className={`waves-effect waves-light btn ${
							exclusion ? "disabled" : ""
						}`}
						onClick={() => setInclusionStatus(true)}
					>
						<i className="material-icons left">add</i>
						{_("Include device")}
					</a>
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
							inclusion ? "disabled" : ""
						}`}
						onClick={() => setExclusionStatus(true)}
					>
						<i className="material-icons left">remove</i>
						{_("Exclude device")}
					</a>
				)}{" "}
				<a
					className={`waves-effect waves-light btn ${
						healingNetwork ? "red" : ""
					}`}
					onClick={() =>
						healingNetwork ? stopHealingNetwork() : healNetwork()
					}
				>
					<i className="material-icons left">network_check</i>
					{healingNetwork ? _("Cancel healing") : _("Heal network")}
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
						{/* <td>Aktionen</td> */}
					</tr>
				</thead>
				<tbody>
					{devicesAsArray.length ? (
						devicesAsArray.map(({ id, value, status }) => {
							const nodeId = value.native.id;
							const deviceHealed =
								networkHealProgress[nodeId] ?? false;
							return (
								<tr key={nodeId}>
									<td>{nodeId}</td>
									<td>{value.common.name}</td>
									<td>{value.native.type.basic}</td>
									<td>
										{/* Whether the device is reachable */}
										<i
											className="material-icons"
											title={_(status ?? "unknown")}
										>
											{statusToIconName(status)}
										</i>
										{/* While healing the network also show the current progress */}
										{healingNetwork && (
											<>
												{" "}
												<i
													className={`material-icons ${
														deviceHealed
															? "green-text text-darken-4"
															: "light-blue-text text-accent-4 working"
													}`}
													title={
														deviceHealed
															? _("done")
															: _("pending")
													}
												>
													{deviceHealed
														? "done"
														: "autorenew"}
												</i>
											</>
										)}
									</td>
									{/* <td>[-]</td> */}
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={6} style={{ textAlign: "center" }}>
								{_("No devices present")}
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* Modal for error messages */}
			<Modal
				id="errorMsg"
				yesButtonText="OK"
				{...message}
				onClose={() => hideMessage()}
			/>
		</>
	);
}
