import { blue, green, orange, red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import AutoRenewIcon from "@material-ui/icons/Autorenew";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import RedoIcon from "@material-ui/icons/Redo";
import { useI18n } from "iobroker-react/hooks";

const useStyles = makeStyles((_theme) => ({
	rebuildRoutesIconPending: {
		color: blue[500],
		animation: "$rotation 1.5s infinite ease-in-out",
		animationFillMode: "forwards",
	},
	rebuildRoutesIconFailed: {
		color: red[500],
	},
	rebuildRoutesIconSkipped: {
		color: orange[800],
	},
	rebuildRoutesIconDone: {
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

interface RebuildRoutesStatusIconProps {
	status: "pending" | "failed" | "skipped" | "done";
}

export const RebuildRoutesStatusIcon: React.FC<RebuildRoutesStatusIconProps> = (
	props,
) => {
	const { status } = props;
	const { translate: _ } = useI18n();
	const classes = useStyles();
	switch (status) {
		case "done":
			return (
				<Tooltip title={_("done")}>
					<DoneIcon className={classes.rebuildRoutesIconDone} />
				</Tooltip>
			);
		case "skipped":
			return (
				<Tooltip title={_("skipped")}>
					<RedoIcon className={classes.rebuildRoutesIconSkipped} />
				</Tooltip>
			);
		case "failed":
			return (
				<Tooltip title={_("failed")}>
					<ErrorOutlineIcon
						className={classes.rebuildRoutesIconFailed}
					/>
				</Tooltip>
			);
		case "pending":
			return (
				<Tooltip title={_("pending")}>
					<AutoRenewIcon
						className={classes.rebuildRoutesIconPending}
					/>
				</Tooltip>
			);
	}
	throw new Error("Unknown route rebuilding status");
};
