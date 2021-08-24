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
import { NodeActions } from "./_nodeActions";
import { useI18n } from "iobroker-react/hooks";
import { DeviceSecurityIcon } from "./DeviceSecurityIcon";

export interface DeviceTableRowProps {
	device: Device;
	healStatus: any;
}

const useStyles = makeStyles((theme) => ({
	mainRow: {
		"& > *": {
			border: 0,
		},
	},
	idCell: {
		display: "flex",
		flexFlow: "row nowrap",
		justifyContent: "space-between",
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
	const { secure, securityClasses } = value.native;

	const [open, setOpen] = React.useState(false);
	const classes = useStyles();
	const { translate: _ } = useI18n();

	console.log(`nodeId: ${nodeId}, ${JSON.stringify(value.native)}`);

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

					<span>{nodeId}</span>
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
					{/* Whether the device is reachable */}
					<DeviceStatusIcon status={status} />
					{/* While healing the network also show the current progress */}
					{!!healStatus && (
						<>
							{" "}
							<HealStatusIcon status={props.healStatus} />
						</>
					)}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell colSpan={5} className={classes.expanderCell}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<NodeActions
							nodeId={nodeId}
							status={status}
							supportsFirmwareUpdate={supportsFirmwareUpdate}
						/>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};
