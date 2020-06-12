import * as React from "react";
import { Device, getNodeStatus, loadDevices } from "./backend";
import { useStateWithRef } from "./stateWithRefs";

export interface DevicesContextData {
	devices: Record<number, Device>;
	updateDevices(): Promise<void>;
}

export const DevicesContext = React.createContext<DevicesContextData>({
	devices: {},
	async updateDevices() {},
});

const deviceIdRegex = /Node_(\d+)$/;
const deviceReadyRegex = /Node_(\d+)\.ready$/;
const deviceStatusRegex = /Node_(\d+)\.status$/;

export function useDevices() {
	// Because the useEffect callback captures stale state, we need to use a ref for all state that is required in the hook
	const [devices, devicesRef, setDevices] = useStateWithRef<
		Record<number, Device>
	>();
	const namespace = `${adapter}.${instance}`;

	const onObjectChange: ioBroker.ObjectChangeHandler = async (id, obj) => {
		if (!id.startsWith(namespace) || !deviceIdRegex.test(id)) return;
		if (obj) {
			// New or changed device object
			if (obj.type === "device" && typeof obj.native.id === "number") {
				const nodeId = obj.native.id;
				const device: Device = {
					id,
					value: obj,
					status: await getNodeStatus(namespace, nodeId),
				};
				setDevices({ ...devicesRef?.current, [nodeId]: device });
			}
		} else {
			const nodeId = parseInt(deviceIdRegex.exec(id)![1], 10);
			const newDevices = { ...devicesRef?.current };
			delete newDevices[nodeId];
			setDevices(newDevices);
		}
	};

	const onStateChange: ioBroker.StateChangeHandler = async (id, state) => {
		if (!id.startsWith(namespace)) return;
		if (!state || !state.ack) return;

		if (id.match(deviceStatusRegex)) {
			// A device's status was changed
			const nodeId = parseInt(deviceStatusRegex.exec(id)![1], 10);
			const updatedDevice = devicesRef?.current?.[nodeId];
			if (updatedDevice) {
				updatedDevice.status = state.val as any;
				setDevices({
					...devicesRef?.current,
					[nodeId]: updatedDevice,
				});
			}
		} else if (id.match(deviceReadyRegex)) {
			// A device's ready state was changed
			const nodeId = parseInt(deviceReadyRegex.exec(id)![1], 10);
			const updatedDevice = devicesRef?.current?.[nodeId];
			if (updatedDevice) {
				updatedDevice.ready = state.val as any;
				setDevices({
					...devicesRef?.current,
					[nodeId]: updatedDevice,
				});
			}
		}
	};

	async function updateDevices(): Promise<void> {
		setDevices(
			await loadDevices(namespace, {
				status: true,
				associations: true,
				ready: true,
			}),
		);
	}

	React.useEffect(() => {
		(async () => {
			// Load devices initially
			await updateDevices();

			// And update them on changes
			socket.on("stateChange", onStateChange);
			socket.on("objectChange", onObjectChange);
		})();

		// componentWillUnmount
		return () => {
			socket.removeEventHandler("stateChange", onStateChange);
			socket.removeEventHandler("objectChange", onObjectChange);
		};
	}, []);

	return [devices, updateDevices] as const;
}
