import * as React from "react";
declare function showNetworkMap(): void;

export class NetworkMap extends React.Component {
	public componentDidMount() {
		showNetworkMap();
	}

	public render() {
		return <div id="map"></div>;
	}
}
