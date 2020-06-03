import * as React from "react";
import { drawNetworkMap } from "../lib/networkMap";
import { NotRunning } from "../components/notRunning";
import {
	subscribeStatesAsync,
	unsubscribeStatesAsync,
	getStateAsync,
} from "../lib/backend";

export function NetworkMap() {
	const [adapterRunning, setAdapterRunning] = React.useState(false);
	const [driverReady, setDriverReady] = React.useState(false);

	React.useEffect(() => {
		const aliveId = `system.adapter.${adapter}.${instance}.alive`;
		const readyId = `${adapter}.${instance}.info.connection`;
		// componentDidMount
		(async () => {
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
	}, []);

	React.useEffect(() => {
		if (adapterRunning && driverReady) {
			sendTo(null, "getNetworkMap", null, ({ error, result: nodes }) => {
				if (error) {
					console.error(error);
				} else {
					drawNetworkMap("#map", nodes);
				}
			});
		}
	}, [adapterRunning, driverReady]);
	return adapterRunning && driverReady ? (
		<div id="map"></div>
	) : (
		<NotRunning />
	);
}
