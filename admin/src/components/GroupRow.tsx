import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { padStart } from "alcalzone-shared/strings";
import { useI18n } from "iobroker-react/hooks";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import RestoreIcon from "@material-ui/icons/Restore";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import { getErrorMessage } from "../../../src/lib/shared";
import { arrayEquals } from "../lib/tools";
import type { Device } from "../lib/useAPI";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export interface GroupRowProps {
	objectId?: string;
	name: string | undefined;
	nodeIds: number[] | undefined;

	selectableNodes: Device[];

	// Will be called when the group should be saved
	save(name: string, nodeIds: number[], oldName?: string): Promise<void>;
	// Will be called when the group should be deleted
	delete?(): Promise<void>;
}

const useStyles = makeStyles((theme) => ({
	input: {
		width: "100%",
		margin: 0,
	},
	cell: {
		padding: theme.spacing(1, 2),
	},
	cellWithId: {
		paddingTop: 0,
	},
	idCell: {
		color: theme.palette.text.hint,
		padding: theme.spacing(1, 2, 0, 2),
		border: 0,
	},
}));

export const GroupRow: React.FC<GroupRowProps> = (props) => {
	const { translate: _ } = useI18n();

	const [name, setName] = React.useState(props.name ?? "");
	const [nodeIds, setNodeIds] = React.useState(props.nodeIds ?? []);

	const [isValid, setValid] = React.useState(false);
	const [hasChanges, setHasChanges] = React.useState(false);
	const [isBusy, setBusy] = React.useState(false);

	React.useEffect(() => {
		setHasChanges(
			(name !== "" && name !== props.name) ||
				!arrayEquals(nodeIds, props.nodeIds ?? []),
		);
		// TODO: Check if the group exists already
		setValid(!!name && nodeIds.length > 1);
	}, [name, props.name, nodeIds, props.nodeIds]);

	const nodesOptions = props.selectableNodes.map((device) => ({
		value: device.value.native.id,
		label: `${_("Node")} ${padStart(
			device.value.native.id.toString(),
			3,
			"0",
		)}`,
	}));
	const selectedNodes = nodesOptions.filter((o) => nodeIds.includes(o.value));

	const isNewGroup = props.name == undefined && props.nodeIds == undefined;

	async function saveGroup() {
		try {
			setBusy(true);
			await props.save(name!, nodeIds.sort(), props.objectId);
			if (isNewGroup) resetGroup();
		} catch (e) {
			alert(_(`The group could not be saved!`));
			console.error(
				`The group could not be saved! Reason: ${getErrorMessage(e)}`,
			);
			resetGroup();
		} finally {
			setBusy(false);
		}
	}

	function resetGroup() {
		setName(props.name ?? "");
		setNodeIds(props.nodeIds ?? []);
	}

	async function deleteGroup() {
		if (!props.delete) return;
		try {
			setBusy(true);
			await props.delete();
		} catch (e) {
			alert(_(`The group could not be deleted!`));
			console.error(
				`The group could not be deleted! Reason: ${getErrorMessage(e)}`,
			);
			resetGroup();
		} finally {
			setBusy(false);
		}
	}

	const classes = useStyles();

	const cellClassName = clsx(
		classes.cell,
		!!props.objectId ? classes.cellWithId : undefined,
	);

	return (
		<>
			{!!props.objectId && (
				<TableRow>
					<TableCell className={classes.idCell} colSpan={3}>
						<Typography variant="caption">
							ID: {props.objectId}
						</Typography>
					</TableCell>
				</TableRow>
			)}
			<TableRow>
				<TableCell className={cellClassName}>
					<TextField
						variant="outlined"
						margin="dense"
						className={classes.input}
						value={name}
						placeholder={_("Enter group name")}
						onChange={(e) => setName(e.target.value)}
					></TextField>
				</TableCell>
				<TableCell className={cellClassName}>
					<Autocomplete
						className={classes.input}
						multiple
						size="small"
						options={nodesOptions}
						disableCloseOnSelect
						getOptionLabel={(option) => option.label}
						value={selectedNodes}
						onChange={(e, value) =>
							setNodeIds(value.map((v) => v.value))
						}
						renderOption={(option, { selected }) => (
							<React.Fragment>
								<Checkbox
									icon={icon}
									checkedIcon={checkedIcon}
									style={{ marginRight: 8 }}
									checked={selected}
								/>
								{option.label}
							</React.Fragment>
						)}
						renderInput={(params) => (
							<TextField
								{...params}
								// margin="dense"
								className={classes.input}
								variant="outlined"
								placeholder={
									selectedNodes.length === 0
										? _("Select nodes")
										: undefined
								}
							/>
						)}
					/>
				</TableCell>

				<TableCell className={cellClassName}>
					<ButtonGroup
						variant="contained"
						color="primary"
						style={{ flex: "1 0 auto" }}
					>
						<Tooltip title={_("Save group")}>
							<Button
								disabled={isBusy || !isValid || !hasChanges}
								onClick={() => saveGroup()}
							>
								{isNewGroup ? <AddIcon /> : <SaveIcon />}
							</Button>
						</Tooltip>

						<Tooltip title={_("Undo changes")}>
							<Button
								disabled={isBusy || !hasChanges}
								onClick={() => resetGroup()}
							>
								<RestoreIcon />
							</Button>
						</Tooltip>

						{!isNewGroup && (
							<Tooltip title={_("Delete group")}>
								<Button
									disabled={isBusy}
									onClick={() => deleteGroup()}
								>
									<DeleteForeverIcon />
								</Button>
							</Tooltip>
						)}
					</ButtonGroup>
				</TableCell>
			</TableRow>
		</>
	);
};
