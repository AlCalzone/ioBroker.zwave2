import * as React from "react";
import { drawNetworkMap, NodeInfo } from "../lib/networkMap";

export class NetworkMap extends React.Component {
	public componentDidMount() {
		sendTo(null, "getNetworkMap", null, ({ error, result: nodes }) => {
			if (error) {
				console.error(error);
			} else {
				drawNetworkMap("#map", nodes);
			}
		});
	}

	public render() {
		return <div id="map"></div>;
	}
}
