import React from "react";

import { useI18n } from "iobroker-react/hooks";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import type { Device } from "../lib/useAPI";
import { DeviceTableRow } from "./DeviceTableRow";
import type { NetworkHealPollResponse } from "../../../src/lib/shared";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		marginTop: theme.spacing(2),
	},
	container: {
		overflowY: "auto",
	},
	empty: {
		textAlign: "center",
		fontStyle: "italic",
	},
}));

export interface DeviceTableProps {
	devices: Device[];
	healingNetwork: boolean;
	networkHealProgress: NonNullable<NetworkHealPollResponse["progress"]>;
}

export const DeviceTable: React.FC<DeviceTableProps> = (props) => {
	const { translate: _ } = useI18n();

	const classes = useStyles();
	const { devices, healingNetwork, networkHealProgress } = props;

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align="right">#</TableCell>
							<TableCell>{_("Name")}</TableCell>
							<TableCell>{_("Type")}</TableCell>
							<TableCell>{_("Status")}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{devices.length ? (
							devices.map((device) => {
								const nodeId = device.value.native.id as number;
								return (
									<DeviceTableRow
										key={`device-${nodeId}`}
										device={device}
										healStatus={
											healingNetwork
												? networkHealProgress[nodeId]
												: undefined
										}
									/>
								);
							})
						) : (
							<TableRow>
								<TableCell
									colSpan={5}
									className={classes.empty}
								>
									{_("No devices present")}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};
