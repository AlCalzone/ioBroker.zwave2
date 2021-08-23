import React from "react";
import { useI18n } from "iobroker-react/hooks";
import DoneIcon from "@material-ui/icons/Done";
import RedoIcon from "@material-ui/icons/Redo";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import AutoRenewIcon from "@material-ui/icons/Autorenew";
import Tooltip from "@material-ui/core/Tooltip";
import { blue, red, orange, green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((_theme) => ({
	healIconPending: {
		color: blue[500],
		animation: "$rotation 1.5s infinite ease-in-out",
		animationFillMode: "forwards",
	},
	healIconFailed: {
		color: red[500],
	},
	healIconSkipped: {
		color: orange[800],
	},
	healIconDone: {
		color: green[900],
	},

	"@keyframes rotation": {
		"0%": {
			transform: "rotate(0deg)",
		},
		"95%": {
			transform: "rotate(720deg)",
			animationFillMode: "none",
		},
		"95.1%": {
			transform: "rotate(0deg)",
		},
	},
}));

interface HealStatusIconProps {
	status: "pending" | "failed" | "skipped" | "done";
}

export const HealStatusIcon: React.FC<HealStatusIconProps> = (props) => {
	const { status } = props;
	const { translate: _ } = useI18n();
	const classes = useStyles();
	switch (status) {
		case "done":
			return (
				<Tooltip title={_("done")}>
					<DoneIcon className={classes.healIconDone} />
				</Tooltip>
			);
		case "skipped":
			return (
				<Tooltip title={_("skipped")}>
					<RedoIcon className={classes.healIconSkipped} />
				</Tooltip>
			);
		case "failed":
			return (
				<Tooltip title={_("failed")}>
					<ErrorOutlineIcon className={classes.healIconFailed} />
				</Tooltip>
			);
		case "pending":
			return (
				<Tooltip title={_("pending")}>
					<AutoRenewIcon className={classes.healIconPending} />
				</Tooltip>
			);
	}
	throw new Error("Unknown heal status");
};
