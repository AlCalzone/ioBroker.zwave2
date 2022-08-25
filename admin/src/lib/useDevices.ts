import { useConnection, useGlobals } from "iobroker-react/hooks";
import { createContext, useEffect, useState } from "react";
import { Device, useAPI } from "./useAPI";
export interface DevicesContextData {
	devices: Record<number, Device>;
	updateDevices(): Promise<void>;
}

export const DevicesContext = createContext<DevicesContextData>({
	devices: {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	async updateDevices() {},
});

const deviceIdRegex = /Node_(\d+)$/;
const deviceReadyRegex = /Node_(\d+)\.ready$/;
const deviceStatusRegex = /Node_(\d+)\.status$/;

export function useDevices(): readonly [
	Record<number, Device> | undefined,
	() => Promise<void>,
] {
	const connection = useConnection();
	const [devices, setDevices] = useState<Record<number, Device>>();
	const { namespace } = useGlobals();
	const api = useAPI();

	const onObjectChange: ioBroker.ObjectChangeHandler = async (id, obj) => {
		if (!id.startsWith(namespace) || !deviceIdRegex.test(id)) return;
		if (obj) {
			// New or changed device object
			if (obj.type === "device" && typeof obj.native.id === "number") {
				const nodeId = obj.native.id;
				const device: Device = {
					id,
					value: obj,
					status: await api.getNodeStatus(nodeId),
					ready: await api.getNodeReady(nodeId),
				};
				if (device.ready) {
					await api.updateEndpointsAndAssociations(nodeId, device);
				}
				setDevices((devices) => ({ ...devices, [nodeId]: device }));
			}
		} else {
			const nodeId = parseInt(deviceIdRegex.exec(id)![1], 10);
			setDevices((devices) => {
				const newDevices = { ...devices };
				delete newDevices[nodeId];
				return newDevices;
			});
		}
	};

	const updateAssociations = async (nodeId: number) => {
		const device = {} as Device;
		await api.updateEndpointsAndAssociations(nodeId, device);
		setDevices((devices) => {
			const updatedDevice = devices?.[nodeId];
			if (updatedDevice) {
				updatedDevice.endpoints = device.endpoints;
				return {
					...devices,
					[nodeId]: updatedDevice,
				};
			} else {
				return devices;
			}
		});
	};

	const onStateChange: ioBroker.StateChangeHandler = async (id, state) => {
		if (!id.startsWith(namespace)) return;
		if (!state || !state.ack) return;

		if (id.match(deviceStatusRegex)) {
			// A device's status was changed
			const nodeId = parseInt(deviceStatusRegex.exec(id)![1], 10);
			setDevices((devices) => {
				const updatedDevice = devices?.[nodeId];
				if (updatedDevice) {
					updatedDevice.status = state.val as any;
					return {
						...devices,
						[nodeId]: updatedDevice,
					};
				} else {
					return devices;
				}
			});
		} else if (id.match(deviceReadyRegex)) {
			// A device's ready state was changed
			const nodeId = parseInt(deviceReadyRegex.exec(id)![1], 10);
			setDevices((devices) => {
				const updatedDevice = devices?.[nodeId];
				if (updatedDevice) {
					updatedDevice.ready = state.val as any;
					// schedule an update of the associations
					if (updatedDevice.ready)
						setTimeout(() => void updateAssociations(nodeId), 0);
					return {
						...devices,
						[nodeId]: updatedDevice,
					};
				} else {
					return devices;
				}
			});
		}
	};

	async function updateDevices(): Promise<void> {
		setDevices(
			await api.loadDevices({
				status: true,
				associations: true,
				ready: true,
			}),
		);
	}

	useEffect(() => {
		(async () => {
			// Load devices initially
			await updateDevices();

			// And update them on changes - these patterns are a bit broad, but we're going to reuse them anyways
			connection.subscribeObject(`${namespace}.Node_*`, onObjectChange);
			connection.subscribeState(`${namespace}.Node_*`, onStateChange);
		})();

		// componentWillUnmount
		return () => {
			connection.unsubscribeObject(`${namespace}.Node_*`, onObjectChange);
			connection.unsubscribeState(`${namespace}.Node_*`, onStateChange);
		};
	}, []);

	return [devices, updateDevices] as const;
}
