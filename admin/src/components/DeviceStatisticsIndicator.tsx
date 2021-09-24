import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import type { ControllerStatistics, NodeStatistics } from "zwave-js";
import {
	ControllerStatisticsTooltip,
	NodeStatisticsTooltip,
} from "./NodeStatisticsTooltip";
import clsx from "clsx";
import { red, green } from "@material-ui/core/colors";

type Status = "active" | "error";

const useStyles = makeStyles((_theme) => ({
	root: {},
	arrow: {
		transition: "fill 0.5s ease-out, filter 0.5s ease-out",
	},
	lArrow: {
		marginLeft: "-24px",
	},
	error: {
		fill: red[800],
		filter: `
			drop-shadow(0 0 10px ${red[300]})
			drop-shadow(0 0 5px ${red[300]})
			drop-shadow(0 0 1px rgba(255,255,255,0.1))
		`,
		transitionDuration: "0.05s",
	},
	active: {
		fill: green[800],
		filter: `
			drop-shadow(0 0 10px ${green[300]})
			drop-shadow(0 0 5px ${green[300]})
			drop-shadow(0 0 1px rgba(255,255,255,0.1))
		`,
		transitionDuration: "0.05s",
	},
}));

export type DeviceStatisticsIndicatorProps =
	| {
			type: "controller";
			statistics?: ControllerStatistics;
	  }
	| {
			type: "node";
			statistics?: NodeStatistics;
	  };

const ArrowUp: React.FC<{ status?: Status }> = (props) => {
	const classes = useStyles();
	return (
		<svg
			className={clsx(
				"MuiSvgIcon-root",
				classes.arrow,
				props.status && classes[props.status],
			)}
			focusable="false"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path d="M9 3 5 6.99h3V14h2V6.99h3L9 3z"></path>
		</svg>
	);
};

const ArrowDown: React.FC<{ status?: Status }> = (props) => {
	const classes = useStyles();
	return (
		<svg
			className={clsx(
				"MuiSvgIcon-root",
				classes.arrow,
				classes.lArrow,
				props.status && classes[props.status],
			)}
			focusable="false"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3z"></path>
		</svg>
	);
};

export const DeviceStatisticsIndicator: React.FC<DeviceStatisticsIndicatorProps> =
	(props) => {
		const [prevStats, setPrevStats] =
			React.useState<typeof props["statistics"]>();
		const [txStatus, setTxStatus] = React.useState<Status>();
		const [rxStatus, setRxStatus] = React.useState<Status>();

		React.useEffect(() => {
			if (prevStats != undefined && props.statistics != undefined) {
				if (props.type === "controller") {
					const prev = prevStats as ControllerStatistics;
					const cur = props.statistics;

					// Check for changes on the TX side
					if (
						prev.NAK < cur.NAK ||
						prev.messagesDroppedTX < cur.messagesDroppedTX ||
						prev.timeoutACK < cur.timeoutACK ||
						prev.timeoutResponse < cur.timeoutResponse ||
						prev.timeoutCallback < cur.timeoutCallback
					) {
						//There was an error transmitting
						setTxStatus("error");
					} else if (prev.messagesTX < cur.messagesTX) {
						// A message was sent
						setTxStatus("active");
					}

					// Check for changes on the RX side
					if (prev.messagesDroppedRX < cur.messagesDroppedRX) {
						//There was an error transmitting
						setRxStatus("error");
					} else if (prev.messagesRX < cur.messagesRX) {
						// A message was sent
						setRxStatus("active");
					}
				} else {
					const prev = prevStats as NodeStatistics;
					const cur = props.statistics as NodeStatistics;

					// Check for changes on the TX side
					if (
						prev.commandsDroppedTX < cur.commandsDroppedTX ||
						prev.timeoutResponse < cur.timeoutResponse
					) {
						//There was an error transmitting
						setTxStatus("error");
					} else if (prev.commandsTX < cur.commandsTX) {
						// A message was sent
						setTxStatus("active");
					}

					// Check for changes on the RX side
					if (prev.commandsDroppedRX < cur.commandsDroppedRX) {
						//There was an error transmitting
						setRxStatus("error");
					} else if (prev.commandsRX < cur.commandsRX) {
						// A message was sent
						setRxStatus("active");
					}
				}
			}
			setPrevStats(props.statistics);
		}, [props.statistics, setTxStatus, setRxStatus, prevStats]);

		// Reset the status after 0.5 seconds when the statistics haven't been changed since then
		React.useEffect(() => {
			const timeout = setTimeout(() => {
				setTxStatus(undefined);
				setRxStatus(undefined);
			}, 500);
			return () => clearTimeout(timeout);
		}, [setTxStatus, setRxStatus, props.statistics]);

		if (props.type === "controller") {
			return (
				<ControllerStatisticsTooltip statistics={props.statistics}>
					<span>
						<ArrowUp status={txStatus} />
						<ArrowDown status={rxStatus} />
					</span>
				</ControllerStatisticsTooltip>
			);
		} else {
			return (
				<NodeStatisticsTooltip statistics={props.statistics}>
					<span>
						<ArrowUp status={txStatus} />
						<ArrowDown status={rxStatus} />
					</span>
				</NodeStatisticsTooltip>
			);
		}
	};
