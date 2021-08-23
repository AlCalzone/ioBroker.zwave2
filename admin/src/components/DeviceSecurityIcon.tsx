import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { green, blue, grey, amber, deepPurple } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import LockIcon from "@material-ui/icons/Lock";
import clsx from "clsx";

const useStyles = makeStyles((_theme) => ({
	root: {
		display: "grid",
		gridTemplateColumns: "repeat(4, 16px)",
		gridTemplateRows: "16px",
	},
	securityIcon: {
		fontSize: "16px",
		color: grey[200],
	},
	s2_accesscontrol: {
		color: green[800],
	},
	s2_authenticated: {
		color: blue[900],
	},
	s2_unauthenticated: {
		color: deepPurple[500],
	},
	s0: {
		color: amber[800],
	},
}));

interface DeviceSecurityIconProps {
	securityClasses: Record<number, boolean>;
}

export const DeviceSecurityIcon: React.FC<DeviceSecurityIconProps> = (
	props,
) => {
	// const { translate: _ } = useI18n();
	const classes = useStyles();

	const { securityClasses } = props;

	return (
		<div className={classes.root}>
			<Tooltip
				title={`S2 Access Control: ${securityClasses[2] ? "✔" : "✘"}`}
			>
				<LockIcon
					className={clsx(
						classes.securityIcon,
						securityClasses[2] && classes.s2_accesscontrol,
					)}
				/>
			</Tooltip>
			<Tooltip
				title={`S2 Authenticated: ${securityClasses[1] ? "✔" : "✘"}`}
			>
				<LockIcon
					className={clsx(
						classes.securityIcon,
						securityClasses[1] && classes.s2_authenticated,
					)}
				/>
			</Tooltip>
			<Tooltip
				title={`S2 Unauthenticated: ${securityClasses[0] ? "✔" : "✘"}`}
			>
				<LockIcon
					className={clsx(
						classes.securityIcon,
						securityClasses[0] && classes.s2_unauthenticated,
					)}
				/>
			</Tooltip>
			<Tooltip title={`S0 Legacy: ${securityClasses[7] ? "✔" : "✘"}`}>
				<LockIcon
					className={clsx(
						classes.securityIcon,
						securityClasses[7] && classes.s0,
					)}
				/>
			</Tooltip>
		</div>
	);
};
