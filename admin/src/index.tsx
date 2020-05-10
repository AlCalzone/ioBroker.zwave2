import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tabs } from "iobroker-react-components";

import { OnSettingsChangedCallback, Settings } from "./pages/settings";
import { NetworkMap } from "./pages/networkMap";
import { Devices } from "./pages/devices";
import { Associations } from "./pages/associations";
import {
	subscribeStatesAsync,
	subscribeObjectsAsync,
	unsubscribeStatesAsync,
	unsubscribeObjectsAsync,
} from "./lib/backend";

// layout components
interface RootProps {
	settings: Record<string, unknown>;
	onSettingsChanged: OnSettingsChangedCallback;
}

let namespace: string;

export class Root extends React.Component<RootProps /*, RootState*/> {
	constructor(props: RootProps) {
		super(props);
		this.state = {};
	}

	public componentDidMount() {
		namespace = `${adapter}.${instance}`;
		// subscribe to changes
		const systemStates = `system.adapter.${namespace}.*`;
		const adapterStates = `${namespace}.*`;
		window.addEventListener("unload", () => this.onUnload());
		void subscribeStatesAsync(systemStates);
		void subscribeObjectsAsync(adapterStates);
		void subscribeStatesAsync(adapterStates);
	}

	public componentWillUnmount() {
		this.onUnload();
	}

	private onUnload() {
		namespace = `${adapter}.${instance}`;
		const systemStates = `system.adapter.${namespace}.*`;
		const adapterStates = `${namespace}.*`;
		void unsubscribeStatesAsync(systemStates);
		void unsubscribeObjectsAsync(adapterStates);
		void unsubscribeStatesAsync(adapterStates);
	}

	public render() {
		return (
			<Tabs
				labels={["Settings", "Devices", "Associations", "Network map"]}
			>
				<Settings
					settings={this.props.settings}
					onChange={this.props.onSettingsChanged}
				/>
				<Devices />
				<Associations />
				<NetworkMap />
			</Tabs>
		);
	}
}

let curSettings: Record<string, unknown>;
let originalSettings: Record<string, unknown>;

/**
 * Checks if any setting was changed
 */
function hasChanges(): boolean {
	if (
		Object.keys(originalSettings).length !== Object.keys(curSettings).length
	)
		return true;
	for (const key of Object.keys(originalSettings)) {
		if (originalSettings[key] !== curSettings[key]) return true;
	}
	return false;
}

// the function loadSettings has to exist ...
(window as any).load = (
	settings: Record<string, unknown>,
	onChange: (hasChanges: boolean) => void,
) => {
	originalSettings = settings;

	const settingsChanged: OnSettingsChangedCallback = (newSettings) => {
		curSettings = newSettings;
		onChange(hasChanges());
	};

	ReactDOM.render(
		<Root settings={settings} onSettingsChanged={settingsChanged} />,
		document.getElementById("adapter-container") ||
			document.getElementsByClassName("adapter-container")[0],
	);

	// Signal to admin, that no changes yet
	onChange(false);
};

// ... and the function save has to exist.
// you have to make sure the callback is called with the settings object as first param!
(window as any).save = (
	callback: (newSettings: Record<string, unknown>) => void,
) => {
	// save the settings
	callback(curSettings);
	originalSettings = curSettings;
};
