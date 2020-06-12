import * as React from "react";
import { NotRunning } from "../components/notRunning";
import { drawNetworkMap } from "../lib/networkMap";
import { AdapterContext } from "../lib/useAdapter";

export function NetworkMap() {
	const { alive: adapterRunning, connected: driverReady } = React.useContext(
		AdapterContext,
	);

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
