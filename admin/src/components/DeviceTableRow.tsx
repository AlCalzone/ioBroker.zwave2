import React from "react";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import type { Device } from "../lib/useAPI";
import { HealStatusIcon } from "./HealStatusIcon";
import { DeviceStatusIcon } from "./DeviceStatusIcon";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import { makeStyles } from "@material-ui/core/styles";
import { NodeActions } from "./NodeActions";
import { useI18n } from "iobroker-react/hooks";
import { DeviceSecurityIcon } from "./DeviceSecurityIcon";
import HomeIcon from "@material-ui/icons/Home";
import Tooltip from "@material-ui/core/Tooltip";
import { ControllerActions } from "./ControllerActions";

export interface DeviceTableRowProps {
	device: Device;
	healStatus: any;
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
	const { healStatus, device } = props;

	const { value, status } = device;
	const nodeId = value.native.id as number;
	const supportsFirmwareUpdate = !!value.native.supportsFirmwareUpdate;
	const { secure, securityClasses, isControllerNode } = value.native;

	const [open, setOpen] = React.useState(isControllerNode);
	const classes = useStyles();
	const { translate: _ } = useI18n();

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
					{(value.native as any).type.specific ??
						(value.native as any).type.generic ??
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
							{/* While healing the network also show the current progress */}
							{!!healStatus && (
								<>
									{" "}
									<HealStatusIcon status={props.healStatus} />
								</>
							)}
						</>
					)}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell colSpan={5} className={classes.expanderCell}>
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
