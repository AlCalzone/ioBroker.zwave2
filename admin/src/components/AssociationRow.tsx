import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles, styled } from "@material-ui/core/styles";
import MuiTableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import RestoreIcon from "@material-ui/icons/Restore";
import SaveIcon from "@material-ui/icons/Save";
import type { AssociationGroup } from "@zwave-js/cc/safe";
import { padStart } from "alcalzone-shared/strings";
import { Dropdown, DropdownOption } from "iobroker-react/components";
import { useI18n } from "iobroker-react/hooks";
import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../../../src/lib/shared";

export interface AssociationRowProps {
	// The existing endpoints on the source node, their defined groups, and existing nodes including endpoints
	endpoints: number[];
	groups: ReadonlyMap<number, (AssociationGroup & { group: number })[]>;
	nodes: { nodeId: number; endpointIndizes?: number[] }[];

	// Whether the target endpoint selection should be shown
	supportsMultiChannel: boolean;

	// The selected association
	sourceEndpoint: number | undefined;
	group: number | undefined;
	nodeId: number | undefined;
	endpoint?: number | undefined;

	// Will be called when the group should be saved
	save(
		sourceEndpoint: number | undefined,
		group: number,
		nodeId: number,
		endpoint: number | undefined,
	): Promise<void>;
	// Will be called when the group should be deleted
	delete?(): Promise<void>;
}

const useStyles = makeStyles((_theme) => ({
	dropdown: {
		width: "100%",
	},
}));

const TableCell = styled(MuiTableCell)(({ theme }) => ({
	padding: theme.spacing(1),
}));

export const AssociationRow: React.FC<AssociationRowProps> = (props) => {
	const { translate: _ } = useI18n();

	const [sourceEndpoint, setSourceEndpoint] = useState(props.sourceEndpoint);
	const [group, setGroup] = useState(props.group);
	const [nodeId, setNodeId] = useState(props.nodeId);
	const [endpoint, setEndpoint] = useState(props.endpoint);

	const [isValid, setValid] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [isBusy, setBusy] = useState(false);

	const groups =
		(sourceEndpoint != undefined && props.groups.get(sourceEndpoint)) || [];

	useEffect(() => {
		setHasChanges(
			sourceEndpoint !== props.sourceEndpoint ||
				group !== props.group ||
				nodeId !== props.nodeId ||
				endpoint !== props.endpoint,
		);
		const groupExists = !!groups.find((g) => g.group === group);
		const node = props.nodes.find((n) => n.nodeId === nodeId);
		const endpointIndizes = node?.endpointIndizes ?? [];
		setValid(
			groupExists &&
				!!node &&
				(endpoint == undefined ||
					endpoint === 0 ||
					endpointIndizes.includes(endpoint)),
		);
	}, [group, groups, nodeId, endpoint]);

	const groupOptions = groups.map(({ group, label }) => ({
		value: group,
		label: `${_("Group")} ${group}: ${label}`,
	}));

	const nodesOptions = props.nodes.map(({ nodeId }) => ({
		value: nodeId,
		label: `${_("Node")} ${padStart(nodeId.toString(), 3, "0")}`,
	}));

	// Update the source endpoint dropdown when necessary
	const sourceEndpointOptions = useMemo(() => {
		const newEndpointOptions: DropdownOption[] = [
			{ value: 0, label: _("Root device") },
		];
		for (const ep of props.endpoints) {
			// The source endpoint does not distinguish between no endpoint and root device
			if (ep === 0) continue;
			newEndpointOptions.push({
				value: ep,
				label: `${_("Endpoint")} ${ep}`,
			});
		}
		return newEndpointOptions;
	}, [props.endpoints]);

	// Update the target endpoint dropdown when necessary
	const targetEndpointOptions = useMemo(() => {
		const endpointIndizes =
			props.nodes.find((n) => n.nodeId === nodeId)?.endpointIndizes ?? [];
		// The endpoint indizes don't include the root endpoint, so we need to add it manually
		if (!endpointIndizes.includes(0)) endpointIndizes.unshift(0);
		const groupSupportsMultiChannel = !!groups.find(
			(g) => g.group === group,
		)?.multiChannel;
		if (!groupSupportsMultiChannel) {
			return [];
		} else {
			const newEndpointOptions: DropdownOption[] = [
				{ value: "none", label: _("Root device") },
			];
			for (const ep of endpointIndizes) {
				newEndpointOptions.push({
					value: ep,
					label:
						ep === 0
							? _("Root endpoint")
							: `${_("Endpoint")} ${ep}`,
				});
			}
			return newEndpointOptions;
		}
	}, [props.nodes, groups, group, nodeId]);

	const isNewAssociation =
		props.sourceEndpoint == undefined &&
		props.group == undefined &&
		props.nodeId == undefined &&
		props.endpoint == undefined;

	async function saveAssociation() {
		try {
			setBusy(true);
			await props.save(sourceEndpoint, group!, nodeId!, endpoint);
			if (isNewAssociation) resetAssociation();
		} catch (e) {
			alert(_(`The association could not be saved!`));
			console.error(
				`The association could not be saved! Reason: ${getErrorMessage(
					e,
				)}`,
			);
			resetAssociation();
		} finally {
			setBusy(false);
		}
	}
	function resetAssociation() {
		setSourceEndpoint(props.sourceEndpoint);
		setGroup(props.group);
		setNodeId(props.nodeId);
		setEndpoint(props.endpoint);
	}
	async function deleteAssociation() {
		if (!props.delete) return;
		try {
			setBusy(true);
			await props.delete();
		} catch (e) {
			alert(_(`The association could not be deleted!`));
			console.error(
				`The association could not be deleted! Reason: ${getErrorMessage(
					e,
				)}`,
			);
			resetAssociation();
		} finally {
			setBusy(false);
		}
	}

	const currentGroup = groups.find((g) => g.group === group);
	const endpointSupportsMultiChannel = groups.some((g) => g.multiChannel);

	const classes = useStyles();

	return (
		<TableRow>
			<TableCell>
				<Dropdown
					className={classes.dropdown}
					options={sourceEndpointOptions}
					selectedOption={sourceEndpoint ?? ""}
					placeholder={_("- select endpoint -")}
					onChange={(e) => {
						setSourceEndpoint(e.target.value as number);
					}}
				/>
			</TableCell>
			<TableCell>
				<Dropdown
					className={classes.dropdown}
					options={groupOptions}
					selectedOption={group}
					placeholder={_("- select group -")}
					onChange={(e) => {
						setGroup(e.target.value as number);
					}}
				/>
			</TableCell>
			<TableCell>
				<Dropdown
					className={classes.dropdown}
					options={nodesOptions}
					selectedOption={nodeId}
					placeholder={_("- select node -")}
					onChange={(e) => {
						setNodeId(e.target.value as number);
					}}
				/>
			</TableCell>
			{props.supportsMultiChannel && (
				<TableCell>
					{currentGroup?.multiChannel &&
						endpointSupportsMultiChannel && (
							<Dropdown
								className={classes.dropdown}
								options={targetEndpointOptions}
								selectedOption={endpoint ?? "none"}
								placeholder={_("- select endpoint -")}
								onChange={(e) => {
									const value = e.target.value;
									setEndpoint(
										value === "none"
											? undefined
											: (value as number),
									);
								}}
							/>
						)}
				</TableCell>
			)}
			<TableCell>
				<ButtonGroup
					variant="contained"
					color="primary"
					style={{ flex: "1 0 auto" }}
				>
					<Tooltip title={_("Save association")}>
						<Button
							disabled={isBusy || !isValid || !hasChanges}
							onClick={() => saveAssociation()}
						>
							{isNewAssociation ? <AddIcon /> : <SaveIcon />}
						</Button>
					</Tooltip>

					<Tooltip title={_("Undo changes")}>
						<Button
							disabled={isBusy || !hasChanges}
							onClick={() => resetAssociation()}
						>
							<RestoreIcon />
						</Button>
					</Tooltip>

					{!isNewAssociation && (
						<Tooltip title={_("Delete association")}>
							<Button
								disabled={isBusy}
								onClick={() => deleteAssociation()}
							>
								<DeleteForeverIcon />
							</Button>
						</Tooltip>
					)}
				</ButtonGroup>
			</TableCell>
		</TableRow>
	);
};
