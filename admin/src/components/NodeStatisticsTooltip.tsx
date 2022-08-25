import { makeStyles } from "@material-ui/core/styles";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import clsx from "clsx";
import { useI18n } from "iobroker-react/hooks";
import type { ControllerStatistics, NodeStatistics } from "zwave-js";

const useStyles = makeStyles((theme) => ({
	tooltip: {
		border: `1px solid ${theme.palette.divider}`,
		backgroundColor: theme.palette.common.white,
		boxShadow: theme.shadows[1],
		color: "rgba(0, 0, 0, 0.87)",
		fontSize: 12,
	},
	arrow: {
		"&::before": {
			border: `1px solid ${theme.palette.divider}`,
			backgroundColor: theme.palette.common.white,
			boxSizing: "border-box",
		},
	},
	root: {
		display: "grid",
		gridTemplateColumns: "auto auto",
		gridGap: theme.spacing(0, 1),
	},
	bad: {
		color: theme.palette.error.main,
		fontWeight: "bold",
	},
}));

const BaseStatisticsTooltip: React.FC<TooltipProps> = (props) => {
	const classes = useStyles();
	return (
		<Tooltip
			arrow
			classes={{
				tooltip: classes.tooltip,
				arrow: classes.arrow,
			}}
			{...props}
		/>
	);
};

export interface NodeStatisticsTooltipProps {
	statistics: NodeStatistics | undefined;
	children: TooltipProps["children"];
}

export const NodeStatisticsTooltip: React.FC<NodeStatisticsTooltipProps> = (
	props,
) => {
	const classes = useStyles();
	const { translate: _ } = useI18n();

	const s = props.statistics ?? {
		commandsRX: 0,
		commandsTX: 0,
		commandsDroppedRX: 0,
		commandsDroppedTX: 0,
		timeoutResponse: 0,
	};

	return (
		<BaseStatisticsTooltip
			title={
				<div className={classes.root}>
					<b>{_("sent")}:</b>
					<span>
						{s.commandsTX}
						{s.commandsDroppedTX > 0 && (
							<>
								{" "}
								<span className={classes.bad}>
									({s.commandsDroppedTX} {_("dropped")})
								</span>
							</>
						)}
					</span>

					<b>{_("received")}:</b>
					<span>
						{s.commandsRX}
						{s.commandsDroppedRX > 0 && (
							<>
								{" "}
								<span className={classes.bad}>
									({s.commandsDroppedRX} {_("dropped")})
								</span>
							</>
						)}
					</span>

					<b>{_("timeouts")}:</b>
					<span
						className={clsx(
							s.timeoutResponse > 0 ? classes.bad : undefined,
						)}
					>
						{s.timeoutResponse}
					</span>
				</div>
			}
		>
			{props.children}
		</BaseStatisticsTooltip>
	);
};

export interface ControllerStatisticsTooltipProps {
	statistics: ControllerStatistics | undefined;
	children: TooltipProps["children"];
}

export const ControllerStatisticsTooltip: React.FC<
	ControllerStatisticsTooltipProps
> = (props) => {
	const classes = useStyles();
	const { translate: _ } = useI18n();

	const s = props.statistics ?? {
		CAN: 0,
		NAK: 0,
		messagesDroppedRX: 0,
		messagesDroppedTX: 0,
		messagesRX: 0,
		messagesTX: 0,
		timeoutACK: 0,
		timeoutCallback: 0,
		timeoutResponse: 0,
	};

	return (
		<BaseStatisticsTooltip
			title={
				<div className={classes.root}>
					<b>{_("sent")}:</b>
					<span>
						{s.messagesTX}
						{s.messagesDroppedTX > 0 && (
							<>
								{" "}
								<span className={classes.bad}>
									({s.messagesDroppedTX} {_("dropped")})
								</span>
							</>
						)}
					</span>

					<b>{_("received")}:</b>
					<span>
						{s.messagesRX}
						{s.messagesDroppedRX > 0 && (
							<>
								{" "}
								<span className={classes.bad}>
									({s.messagesDroppedRX} {_("dropped")})
								</span>
							</>
						)}
					</span>

					<b>{_("timeouts")}:</b>
					<div>
						ACK: <span className={classes.bad}>{s.timeoutACK}</span>
						<br />
						RES:{" "}
						<span className={classes.bad}>{s.timeoutResponse}</span>
						<br />
						CB:{" "}
						<span className={classes.bad}>{s.timeoutCallback}</span>
					</div>

					<b>{_("collisions")}:</b>
					<span>{s.CAN}</span>

					<b>{_("corrupt")}:</b>
					<span className={classes.bad}>{s.NAK}</span>
				</div>
			}
		>
			{props.children}
		</BaseStatisticsTooltip>
	);
};
