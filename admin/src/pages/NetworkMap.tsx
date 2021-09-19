import React from "react";
import { NotRunning } from "../components/Messages";
import { drawNetworkMap } from "../lib/networkMap";
import { useAdapter } from "iobroker-react/hooks";
import { useAPI } from "../lib/useAPI";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	map: {
		"& text": {
			fill: theme.palette.text.primary,
		},
	},
}));

export const NetworkMap: React.FC = () => {
	const { alive: adapterRunning, connected: driverReady } = useAdapter();
	const api = useAPI();
	const classes = useStyles();

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
		<div id="map" className={classes.map}></div>
	) : (
		<NotRunning />
	);
};
