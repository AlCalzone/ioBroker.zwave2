import React from "react";
import { useI18n } from "iobroker-react/hooks";
import Tooltip from "@material-ui/core/Tooltip";
import { red, green, lightBlue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import WifiIcon from "@material-ui/icons/Wifi";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import DeviceUnknownIcon from "@material-ui/icons/DeviceUnknown";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import type { Device } from "../lib/useAPI";

const useStyles = makeStyles((_theme) => ({
	deviceIconAlive: {
		color: green[800],
	},
	deviceIconAsleep: {
		color: lightBlue[500],
	},
	deviceIconDead: {
		color: red[900],
	},
}));

interface DeviceStatusIconProps {
	status: Device["status"];
}

export const DeviceStatusIcon: React.FC<DeviceStatusIconProps> = (props) => {
	const { status } = props;
	const { translate: _ } = useI18n();
	const classes = useStyles();

	const title = _(status ?? "unknown");

	switch (status) {
		case "alive":
		case "awake":
			return (
				<Tooltip title={title}>
					<WifiIcon className={classes.deviceIconAlive} />
				</Tooltip>
			);
		case "asleep":
			return (
				<Tooltip title={title}>
					<PowerSettingsNewIcon
						className={classes.deviceIconAsleep}
					/>
				</Tooltip>
			);
		case "dead":
			return (
				<Tooltip title={title}>
					<WifiOffIcon className={classes.deviceIconDead} />
				</Tooltip>
			);
		default:
			return (
				<Tooltip title={title}>
					<DeviceUnknownIcon />
				</Tooltip>
			);
	}
};
