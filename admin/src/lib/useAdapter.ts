import * as React from "react";
import { getStateAsync } from "./backend";

export interface AdapterContextData {
	alive: boolean;
	connected: boolean;
}

export const AdapterContext = React.createContext<AdapterContextData>({
	alive: false,
	connected: false,
});

export function useAdapter() {
	const [alive, setAlive] = React.useState(false);
	const [connected, setConnected] = React.useState(false);

	const namespace = `${adapter}.${instance}`;
	const aliveId = `system.adapter.${namespace}.alive`;
	const connectedId = `${namespace}.info.connection`;

	const onStateChange: ioBroker.StateChangeHandler = async (id, state) => {
		if (!state || !state.ack) return;

		if (id === aliveId) {
			setAlive(!!state?.val);
		} else if (id === connectedId) {
			setConnected(!!state?.val);
		}
	};

	React.useEffect(() => {
		(async () => {
			// Load adapter status initially
			setAlive(!!(await getStateAsync(aliveId))?.val);
			setConnected(!!(await getStateAsync(connectedId))?.val);

			// And update it on changes
			socket.on("stateChange", onStateChange);
		})();

		// componentWillUnmount
		return () => {
			socket.removeEventHandler("stateChange", onStateChange);
		};
	}, []);

	return [alive, connected] as const;
}
