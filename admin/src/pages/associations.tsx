import * as React from "react";
import { NotRunning } from "../components/notRunning";
import {
	subscribeStatesAsync,
	unsubscribeStatesAsync,
	getStateAsync,
} from "../lib/backend";

export function Associations() {
	const [adapterRunning, setAdapterRunning] = React.useState(false);
	const [driverReady, setDriverReady] = React.useState(false);

	React.useEffect(() => {
		const aliveId = `system.adapter.${adapter}.${instance}.alive`;
		const readyId = `${adapter}.${instance}.info.connection`;
		// componentDidMount
		(async () => {
			// subscribe to changes
			await subscribeStatesAsync(aliveId);
			await subscribeStatesAsync(readyId);
			// And unsubscribe when the page is unloaded
			window.addEventListener("unload", () => {
				void unsubscribeStatesAsync(aliveId);
				void unsubscribeStatesAsync(readyId);
			});

			socket.on("stateChange", async (id, state) => {
				if (!state || !state.ack) return;
				if (id === aliveId) {
					setAdapterRunning(!!state?.val);
				} else if (id === readyId) {
					setDriverReady(!!state?.val);
				}
			});

			setAdapterRunning(!!(await getStateAsync(aliveId)).val);
			setDriverReady(!!(await getStateAsync(readyId)).val);
		})();

		// componentWillUnmount
		return () => {
			void unsubscribeStatesAsync(aliveId);
			void unsubscribeStatesAsync(readyId);
		};
	}, []);

	React.useEffect(() => {
		if (adapterRunning && driverReady) {
			// TODO: Show Associations
		}
	}, [adapterRunning, driverReady]);
	return adapterRunning && driverReady ? (
		<div id="associations">associations</div>
	) : (
		<NotRunning />
	);
}
