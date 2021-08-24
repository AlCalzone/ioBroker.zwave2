import React from "react";
import {
	useIoBrokerState,
	useAdapter,
	useGlobals,
	useI18n,
} from "iobroker-react/hooks";
import GetAppIcon from "@material-ui/icons/GetApp";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useAPI } from "../lib/useAPI";

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1, 0),
	},
}));

export const UpdateDeviceConfig: React.FC = () => {
	const { alive: adapterRunning, connected: driverReady } = useAdapter();
	const { translate: _ } = useI18n();
	const classes = useStyles();

	const { namespace } = useGlobals();
	const api = useAPI();

	const [configUpdate] = useIoBrokerState<string>({
		id: `${namespace}.info.configUpdate`,
	});
	const [configVersion] = useIoBrokerState<string>({
		id: `${namespace}.info.configVersion`,
	});
	const [configUpdating] = useIoBrokerState<string>({
		id: `${namespace}.info.configUpdating`,
	});
	const [busy, setBusy] = React.useState(false);

	async function update(): Promise<void> {
		setBusy(true);
		const result = await api.updateConfig();
		setBusy(false);
		if (!result) alert(_("Updating the configuration DB failed!"));
	}

	if (!adapterRunning || !driverReady) return <></>;
	if (!configUpdate) {
		return (
			<>
				<Typography variant="body2">
					{_("Configuration DB is up to date")}
					<br />
					{_("Installed version")}: {configVersion}
				</Typography>
			</>
		);
	} else if (busy || configUpdating) {
		return (
			<Typography variant="body2">
				{_("Updating configuration DB - please wait...")}
			</Typography>
		);
	}

	return (
		<div>
			<Typography variant="body2">
				{_("Update for configuration DB available")}: {configUpdate}
			</Typography>
			<Typography variant="body2">
				{_("Installed version")}: {configVersion}
			</Typography>
			<Button
				className={classes.button}
				variant="contained"
				color="primary"
				onClick={() => update()}
				startIcon={<GetAppIcon />}
			>
				{_("Update configuration DB")}
			</Button>
			<Typography variant="body2">
				{_("config update disclaimer")}
			</Typography>
		</div>
	);
};
