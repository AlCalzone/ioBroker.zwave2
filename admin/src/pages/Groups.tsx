import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Alert from "@material-ui/lab/Alert";
import { useI18n } from "iobroker-react/hooks";
import { GroupRow } from "../components/GroupRow";
import type { Device } from "../lib/useAPI";
import { nameFromGroupObject, useGroups } from "../lib/useGroups";

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

export interface GroupsProps {
	devices: Record<number, Device> | undefined;
}

export const Groups: React.FC<GroupsProps> = (props) => {
	const classes = useStyles();
	const { translate: _ } = useI18n();
	const { groups, saveGroup, deleteGroup } = useGroups();

	if (!props.devices || !groups) return <CircularProgress />;

	const selectableNodes = Object.values(props.devices).filter((device) => {
		const { isControllerNode, securityClasses, secure, canSleep } =
			device.value.native;
		// Sleeping nodes and the controller cannot be targets for multicast
		if (isControllerNode || canSleep) return false;
		// Insecure nodes can be used for multicast
		if (secure === false) return true;
		// Secure nodes can only be used for multicast if they support S2
		if (securityClasses["S2_AccessControl"] === true) return true;
		if (securityClasses["S2_Authenticated"] === true) return true;
		if (securityClasses["S2_Unauthenticated"] === true) return true;
		if (securityClasses["S0_Legacy"] === true) return false;

		// Default should be true to avoid https://github.com/AlCalzone/ioBroker.zwave2/issues/815
		return true;
	});

	return (
		<>
			<Alert severity="info">{_("no multicast explanation")}</Alert>

			<Paper className={classes.root} elevation={2}>
				<TableContainer className={classes.container}>
					<Table style={{ tableLayout: "auto" }}>
						<TableHead>
							<TableRow>
								<TableCell style={{ width: "50%" }}>
									{_("Group name")}
								</TableCell>
								<TableCell style={{ width: "50%" }}>
									{_("Nodes")}
								</TableCell>
								<TableCell
									style={{ minWidth: "200px" }}
								></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{Object.entries(groups).map(([id, group]) => (
								<GroupRow
									objectId={group._id}
									key={`group-${id}`}
									name={nameFromGroupObject(group)}
									nodeIds={group.native.nodeIds}
									selectableNodes={selectableNodes}
									save={saveGroup}
									delete={() => deleteGroup(group)}
								/>
							))}
							{/* Empty row to add new associations */}
							<GroupRow
								name={undefined}
								nodeIds={undefined}
								selectableNodes={selectableNodes}
								save={saveGroup}
							/>
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</>
	);
};
