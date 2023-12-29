import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { useGlobals, useI18n, useIoBrokerState } from "iobroker-react/hooks";
import { useEffect, useState } from "react";
import type { ControllerStatistics, NodeStatistics } from "zwave-js";
import { computeDeviceId } from "../../../src/lib/shared";
import type { Device } from "../lib/useAPI";
import { ControllerActions } from "./ControllerActions";
import { DeviceSecurityIcon } from "./DeviceSecurityIcon";
import { DeviceStatisticsIndicator } from "./DeviceStatisticsIndicator";
import { DeviceStatusIcon } from "./DeviceStatusIcon";
import { NodeActions } from "./NodeActions";
import { RebuildRoutesStatusIcon } from "./RebuildRoutesStatusIcon";

export interface DeviceTableRowProps {
	device: Device;
	rebuildRoutesStatus: any;
	isBusy: boolean;
	setBusy: (isBusy: boolean) => void;
	replaceFailedNode: () => void;
}

const useStyles = makeStyles((theme) => ({
	mainRow: {
		"& > *": {
			border: 0,
		},
	},
	controllerIcon: {
		fontSize: "16px",
		margin: "7px",
		color: theme.palette.text.secondary,
	},
	idCell: {
		display: "flex",
		flexFlow: "row nowrap",
		// justifyContent: "space-between",
		alignItems: "center",
	},
	expanderCell: {
		paddingBottom: 0,
		paddingTop: 0,
		background: theme.palette.background.default,
	},
}));

export const DeviceTableRow: React.FC<DeviceTableRowProps> = (props) => {
	const { rebuildRoutesStatus, device } = props;

	const { value, status } = device;
	const nodeId = value.native.id as number;
	const supportsFirmwareUpdate = !!value.native.supportsFirmwareUpdate;
	const { secure, securityClasses, isControllerNode } = value.native;

	const [open, setOpen] = useState(isControllerNode);
	const classes = useStyles();
	const { translate: _ } = useI18n();

	const { namespace } = useGlobals();
	const [stringifiedStatistics] = useIoBrokerState<string>({
		id: isControllerNode
			? `${namespace}.info.statistics`
			: `${namespace}.${computeDeviceId(nodeId)}.info.statistics`,
	});
	const [statistics, setStatistics] = useState<
		ControllerStatistics | NodeStatistics
	>();
	useEffect(() => {
		if (stringifiedStatistics) {
			try {
				const parsed = JSON.parse(stringifiedStatistics);
				setStatistics(parsed);
			} catch (e) {
				console.error(e);
			}
		}
	}, [stringifiedStatistics]);

	return (
		<>
			<TableRow hover className={classes.mainRow}>
				<TableCell className={classes.idCell}>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? (
							<KeyboardArrowUpIcon />
						) : (
							<KeyboardArrowDownIcon />
						)}
					</IconButton>

					<span style={{ marginLeft: "auto" }}>{nodeId}</span>
				</TableCell>
				<TableCell>{value.common.name}</TableCell>
				<TableCell>
					{(value.native as any).type?.specific ??
						(value.native as any).type?.generic ??
						_("unknown")}
				</TableCell>
				<TableCell>
					{secure && securityClasses && (
						<DeviceSecurityIcon securityClasses={securityClasses} />
					)}
				</TableCell>
				<TableCell>
					{isControllerNode ? (
						<Tooltip title={_("Controller node")}>
							<HomeIcon />
						</Tooltip>
					) : (
						<>
							{/* Whether the device is reachable */}
							<DeviceStatusIcon status={status} />
							{/* While rebuilding routes also show the current progress */}
							{!!rebuildRoutesStatus && (
								<>
									{" "}
									<RebuildRoutesStatusIcon
										status={props.rebuildRoutesStatus}
									/>
								</>
							)}
						</>
					)}
				</TableCell>
				<TableCell>
					<DeviceStatisticsIndicator
						type={isControllerNode ? "controller" : "node"}
						statistics={statistics as any}
					/>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell colSpan={6} className={classes.expanderCell}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						{isControllerNode ? (
							<ControllerActions
								isBusy={props.isBusy}
								setBusy={props.setBusy}
							/>
						) : (
							<NodeActions
								nodeId={nodeId}
								status={status}
								isBusy={props.isBusy}
								setBusy={props.setBusy}
								supportsFirmwareUpdate={supportsFirmwareUpdate}
								replaceFailedNode={props.replaceFailedNode}
							/>
						)}
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};
