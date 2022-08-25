import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";

const useStyles = makeStyles((theme) => ({
	tooltip: {
		verticalAlign: "middle",
	},
	icon: {
		color: theme.palette.text.hint,
		cursor: "help",
	},
}));

export interface TooltipIconProps {
	tooltip: string;
}

export const TooltipIcon: React.FC<TooltipIconProps> = (props) => {
	const classes = useStyles();
	return (
		<Tooltip title={props.tooltip} className={classes.tooltip}>
			<LiveHelpIcon className={classes.icon} />
		</Tooltip>
	);
};
