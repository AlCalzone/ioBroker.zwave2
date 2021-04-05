import type { Association, AssociationGroup } from "zwave-js/CommandClass";
import {
	AssociationDefinition,
	computeDeviceId,
} from "../../../src/lib/shared";

export async function subscribeObjectsAsync(pattern: string): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("subscribeObjects", pattern, async (error) => {
			if (error) reject(error);
			resolve();
		});
	});
}

export async function subscribeStatesAsync(pattern: string): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("subscribeStates", pattern, async (error) => {
			if (error) reject(error);
			resolve();
		});
	});
}

export async function unsubscribeObjectsAsync(pattern: string): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("unsubscribeObjects", pattern, async (error) => {
			if (error) reject(error);
			resolve();
		});
	});
}

export async function unsubscribeStatesAsync(pattern: string): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("unsubscribeStates", pattern, async (error) => {
			if (error) reject(error);
			resolve();
		});
	});
}

export async function setStateAsync(
	id: string,
	value: Parameters<ioBroker.Adapter["setStateAsync"]>[1],
): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("setState", id, value, (err, result) => {
			if (err) reject(err);
			resolve();
		});
	});
}

export async function getStateAsync(id: string): Promise<ioBroker.State> {
	return new Promise((resolve, reject) => {
		// retrieve all devices
		socket.emit("getState", id, (err, state?: ioBroker.State) => {
			if (err) reject(err);
			resolve(state!);
		});
	});
}

export interface Device {
	id: string;
	value: ioBroker.DeviceObject;
	status?: "unknown" | "alive" | "asleep" | "awake" | "dead";
	ready?: boolean;
	associationGroups?: Record<number, AssociationGroup>;
	associations?: Record<number, Association[]>;
}

export async function getNodeStatus(
	namespace: string,
	nodeId: number,
): Promise<Device["status"]> {
	return (
		await getStateAsync(`${namespace}.${computeDeviceId(nodeId)}.status`)
	).val as Device["status"];
}

export async function getNodeReady(
	namespace: string,
	nodeId: number,
): Promise<boolean> {
	return (
		await getStateAsync(`${namespace}.${computeDeviceId(nodeId)}.ready`)
	).val as boolean;
}

export async function getAssociationGroups(
	nodeId: number,
): Promise<Device["associationGroups"]> {
	return new Promise((resolve, reject) => {
		sendTo(null, "getAssociationGroups", { nodeId }, ({ result }) => {
			// Some nodes don't support associations, ignore them
			resolve(result);
		});
	});
}

export async function getAssociations(
	nodeId: number,
): Promise<Device["associations"]> {
	return new Promise((resolve, reject) => {
		sendTo(null, "getAssociations", { nodeId }, ({ result }) => {
			// Some nodes don't support associations, ignore them
			resolve(result);
		});
	});
}

export async function addAssociation(
	nodeId: number,
	association: AssociationDefinition,
): Promise<void> {
	return new Promise((resolve, reject) => {
		sendTo(
			null,
			"addAssociation",
			{ nodeId, association },
			({ result, error }) => {
				if (error) reject(error);
				resolve(result);
			},
		);
	});
}

export async function removeAssociation(
	nodeId: number,
	association: AssociationDefinition,
): Promise<void> {
	return new Promise((resolve, reject) => {
		sendTo(
			null,
			"removeAssociation",
			{ nodeId, association },
			({ result, error }) => {
				if (error) reject(error);
				resolve(result);
			},
		);
	});
}

export async function loadDevices(
	namespace: string,
	options: {
		status?: boolean;
		ready?: boolean;
		associations?: boolean;
	} = {},
): Promise<Record<number, Device>> {
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
						const nodeId = device.value.native.id as number;
						if (options.ready) {
							device.ready = await getNodeReady(
								namespace,
								nodeId,
							);
						}
						if (options.status) {
							device.status = await getNodeStatus(
								namespace,
								nodeId,
							);
						}
						if (options.associations && device.ready) {
							device.associationGroups = await getAssociationGroups(
								nodeId,
							);
							device.associations = await getAssociations(nodeId);
						}
						ret[nodeId] = device;
					}
				}
				resolve(ret);
			},
		);
	});
}
