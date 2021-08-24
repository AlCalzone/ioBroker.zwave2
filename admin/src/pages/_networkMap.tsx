import React from "react";
import { NotRunning } from "../components/_messages";
import { drawNetworkMap } from "../lib/networkMap";
import { useAdapter } from "iobroker-react/hooks";
import { useAPI } from "../lib/useAPI";

export const NetworkMap: React.FC = () => {
	const { alive: adapterRunning, connected: driverReady } = useAdapter();
	const api = useAPI();

	React.useEffect(() => {
		if (adapterRunning && driverReady) {
			api.getNetworkMap()
				.then((nodes) => {
					drawNetworkMap("#map", nodes);
				})
				.catch((e) => {
					console.error(e);
				});
		}
	}, [adapterRunning, driverReady, api]);
	return adapterRunning && driverReady ? (
		<div id="map"></div>
	) : (
		<NotRunning />
	);
};
