import * as React from "react";
import { updateConfig } from "../lib/backend";
import { AdapterContext } from "../lib/useAdapter";
import { useIoBrokerState } from "../lib/useIoBrokerState";

export const UpdateDeviceConfig: React.FC = () => {
	const { alive: adapterRunning, connected: driverReady } = React.useContext(
		AdapterContext,
	);

	const namespace = `${adapter}.${instance}`;
	const [configUpdate] = useIoBrokerState<string>(
		`${namespace}.info.configUpdate`,
	);
	const [configVersion] = useIoBrokerState<string>(
		`${namespace}.info.configVersion`,
	);
	const [configUpdating] = useIoBrokerState<string>(
		`${namespace}.info.configUpdating`,
	);
	const [busy, setBusy] = React.useState(false);

	async function update(): Promise<void> {
		setBusy(true);
		const result = await updateConfig();
		setBusy(false);
		if (!result) alert(_("Updating the configuration DB failed!"));
	}

	if (!adapterRunning || !driverReady) return <></>;
	if (!configUpdate) {
		return (
			<>
				{_("Configuration DB is up to date")}
				<br />
				{_("Installed version")}: {configVersion}
			</>
		);
	} else if (busy || configUpdating) {
		return <>{_("Updating configuration DB - please wait...")}</>;
	}

	return (
		<>
			{_("Update for configuration DB available")}: {configUpdate}
			<br />
			{_("Installed version")}: {configVersion}
			<br />
			<a className={`btn`} onClick={() => update()}>
				<i className="material-icons tiny left">loop</i>
				{_("Update configuration DB")}
			</a>
			<p>{_("config update disclaimer")}</p>
		</>
	);
};
