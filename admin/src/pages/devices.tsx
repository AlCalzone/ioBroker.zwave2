import * as React from "react";
import { computeDeviceId } from "../../../src/lib/shared";

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

async function pollHealingStatus(): Promise<any> {
	return new Promise<any>((resolve, reject) => {
		sendTo(null, "healNetworkPoll", null, ({ error, result }) => {
			if (error) reject(error);
			resolve(result);
		});
	});
}

interface DevicesState {
	devices?: Record<number, Device>;
	inclusion: boolean;
	exclusion: boolean;
	healNetwork: boolean;
}

export class Devices extends React.Component<{}, DevicesState> {
	public constructor(props: any) {
		super(props);
		this.state = {
			devices: undefined as any,
			inclusion: false,
			exclusion: false,
			healNetwork: false,
		};
	}

	public async componentDidMount() {
		namespace = `${adapter}.${instance}`;
		const devices = await loadDevices();
		const inclusion = await getInclusionStatus();
		const exclusion = await getExclusionStatus();
		this.setState({ devices, inclusion, exclusion });

		// subscribe to changes
		socket.emit("subscribeObjects", namespace + ".*");
		socket.emit("subscribeStates", namespace + ".*");

		socket.on("objectChange", async (id, obj) => {
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
						status: await getNodeStatus(nodeId),
					};
					this.setState(state => ({
						devices: {
							...state.devices,
							[nodeId]: device,
						},
					}));
				}
			} else {
				const nodeId = parseInt(deviceIdRegex.exec(id)![1], 10);
				this.setState(state => {
					const devices = { ...state.devices };
					delete devices[nodeId];
					return { devices };
				});
			}
		});

		socket.on("stateChange", async (id, state) => {
			if (!id.startsWith(namespace)) return;
			if (!state || !state.ack) return;

			if (id.match(deviceStatusRegex)) {
				// A device's status was changed
				const nodeId = parseInt(deviceStatusRegex.exec(id)![1], 10);
				this.setState(s => {
					const device = s.devices?.[nodeId];
					if (device) device.status = state.val;

					return {
						devices: {
							...s.devices,
							[nodeId]: device,
						},
					};
				});
			} else if (id.match(inclusionRegex)) {
				this.setState({ inclusion: !!state.val });
			} else if (id.match(exclusionRegex)) {
				this.setState({ exclusion: !!state.val });
			} else if (id.match(healNetworkRegex)) {
				this.setState({ healNetwork: !!state.val });
			}
		});
	}

	public componentWillUnmount() {
		socket.emit("unsubscribeObjects", namespace + ".*");
		socket.emit("unsubscribeStates", namespace + ".*");
	}

	private healNetwork() {
		sendTo(null, "healNetwork", null, async ({ error, result }) => {
			if (error) {
				alert(error);
			} else if (result === "ok") {
				alert(`Heal network started`);
				// Begin polling
				while (this.state.healNetwork) {
					try {
						const result = await pollHealingStatus();
						console.log(`Healing status:`);
						console.log(result);
						if (result.type === "done") {
							alert("Heal network done!");
							break;
						}
					} catch (e) {
						console.error(`Error while polling: ${e}`);
					}
				}
			}
		});
	}

	public render() {
		const devices: Device[] = [];
		if (this.state.devices) {
			for (const nodeId of Object.keys(this.state.devices)) {
				const device = this.state.devices[nodeId];
				if (device) devices.push(device);
			}
		}

		return (
			<>
				<div id="device-controls">
					{this.state.inclusion ? (
						<a
							className={`waves-effect waves-light btn`}
							onClick={() => setInclusionStatus(false)}
						>
							<i className="material-icons left">cancel</i>
							{_("Cancel inclusion")}
						</a>
					) : (
						<a
							className={`waves-effect waves-light btn ${
								this.state.exclusion ? "disabled" : ""
							}`}
							onClick={() => setInclusionStatus(true)}
						>
							<i className="material-icons left">add</i>
							{_("Include device")}
						</a>
					)}{" "}
					{this.state.exclusion ? (
						<a
							className={`waves-effect waves-light btn`}
							onClick={() => setExclusionStatus(false)}
						>
							<i className="material-icons left">cancel</i>
							{_("Cancel exclusion")}
						</a>
					) : (
						<a
							className={`waves-effect waves-light btn ${
								this.state.inclusion ? "disabled" : ""
							}`}
							onClick={() => setExclusionStatus(true)}
						>
							<i className="material-icons left">remove</i>
							{_("Exclude device")}
						</a>
					)}{" "}
					<a
						className={`waves-effect waves-light btn ${
							this.state.healNetwork ? "disabled" : ""
						}`}
						onClick={() => this.healNetwork()}
					>
						<i className="material-icons left">network_check</i>
						{_("Heal network")}
					</a>
				</div>
				<div className="divider"></div>
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
						{devices.length ? (
							devices.map(({ id, value, status }) => (
								<tr key={id}>
									<td>{value.native.id}</td>
									<td>{value.common.name}</td>
									<td>{value.native.type.basic}</td>
									<td>
										<i
											className="material-icons"
											title={_(status ?? "unknown")}
										>
											{statusToIconName(status)}
										</i>
									</td>
									{/* <td>[-]</td> */}
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6} style={{ textAlign: "center" }}>
									{_("No devices present")}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</>
		);
	}
}
