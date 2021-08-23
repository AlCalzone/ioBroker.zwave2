import { padStart } from "alcalzone-shared/strings";
import React from "react";
import type { AssociationGroup } from "zwave-js";
import type { AssociationDefinition } from "../../../src/lib/shared";
import type { Device } from "../lib/useAPI";
import { AssociationRow } from "./AssociationRow";
import { DeviceStatusIcon } from "./DeviceStatusIcon";
import { NodeNotReady } from "./Messages";
import { useI18n } from "iobroker-react/hooks";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
	headline: {
		backgroundColor: theme.palette.background.default,
		margin: theme.spacing(-2),
		marginBottom: 0,
		borderBottom: `1px solid ${theme.palette.divider}`,
		padding: theme.spacing(2),
	},
	nodeNumber: {
		"& > *": {
			verticalAlign: "middle",
		},
	},
	paper: {
		padding: theme.spacing(2),
		backgroundColor: theme.palette.background.paper,
		marginTop: theme.spacing(4),
		"&:first-child": {
			margin: 0,
		},
	},
}));

interface AssociationNodeTableHeadlineProps {
	device: Device;
}

function AssociationNodeTableHeadline(
	props: AssociationNodeTableHeadlineProps,
) {
	const { translate: _ } = useI18n();

	const { value, status } = props.device;
	const nodeId = value.native.id as number;
	const nodeName =
		value.common.name && !(value.common.name as string).startsWith("Node")
			? value.common.name
			: undefined;

	const classes = useStyles();

	return (
		<div className={classes.headline}>
			<Typography
				variant="h5"
				component="h2"
				className={classes.nodeNumber}
			>
				<span>
					{_("Node")} {padStart(nodeId.toString(), 3, "0")}
				</span>
				&nbsp;
				<DeviceStatusIcon status={status} />
			</Typography>
			{nodeName && (
				<Typography variant="h6" component="h3">
					{nodeName}
				</Typography>
			)}
		</div>
	);
}

function AssociationNodeTableContent(props: AssociationNodeTableProps) {
	const { translate: _ } = useI18n();

	const { endpoints, value } = props.device;
	const nodeId = value.native.id as number;

	// Contains a flat array of all association definitions by endpoint
	const {
		sourceEndpoints,
		groups,
		supportsMultiChannel,
		hasAssociations,
		associations,
	} = React.useMemo(() => {
		const definitions: AssociationDefinition[] = [];
		let hasAssociations = false;
		let supportsMultiChannel = false;
		const groups = new Map<
			number,
			(AssociationGroup & { group: number })[]
		>();
		const sourceEndpoints: number[] = [];
		if (endpoints) {
			for (const [index, endpoint] of endpoints) {
				if (!endpoint.associationGroups) {
					groups.set(index, []);
				} else {
					supportsMultiChannel ||= Object.values(
						endpoint.associationGroups,
					).some((a) => !!a.multiChannel);
					groups.set(
						index,
						Object.entries(endpoint.associationGroups).map(
							([group, def]) => ({
								group: parseInt(group),
								...def,
							}),
						),
					);
				}

				if (endpoint.associations) {
					definitions.push(
						...Object.entries(endpoint.associations)
							.map(([group, assocs]) =>
								assocs.map((a) => ({
									sourceEndpoint: index,
									group: parseInt(group),
									...a,
								})),
							)
							.reduce((acc, cur) => [...acc, ...cur], [])
							.sort((a1, a2) => {
								return (
									a1.group - a2.group ||
									a1.nodeId - a2.nodeId ||
									(a1.endpoint ?? -1) - (a2.endpoint ?? -1)
								);
							}),
					);
					hasAssociations ||=
						Object.keys(endpoint.associations).length > 0;
				}
			}
			if (supportsMultiChannel) sourceEndpoints.push(0);
			sourceEndpoints.push(...endpoints.keys());
		}
		return {
			sourceEndpoints,
			groups,
			supportsMultiChannel,
			hasAssociations,
			associations: definitions,
		};
	}, [endpoints]);

	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableCell>{_("Source endpoint")}</TableCell>
					<TableCell>{_("Group")}</TableCell>
					<TableCell>{_("Target node")}</TableCell>
					{supportsMultiChannel && (
						<TableCell>{_("Target endpoint")}</TableCell>
					)}
					<TableCell>&nbsp;</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{hasAssociations ? (
					associations.map((assoc) => (
						<AssociationRow
							key={`from${nodeId}${
								assoc.sourceEndpoint ?? -1
							}-to${assoc.group}-${assoc.nodeId}-${
								assoc.endpoint ?? -1
							}`}
							endpoints={sourceEndpoints ?? []}
							groups={groups}
							nodes={props.nodes.filter(
								(n) => n.nodeId !== nodeId,
							)}
							sourceEndpoint={assoc.sourceEndpoint ?? 0}
							group={assoc.group}
							nodeId={assoc.nodeId}
							endpoint={assoc.endpoint}
							supportsMultiChannel={supportsMultiChannel}
							save={(
								sourceEndpoint,
								group,
								targetNodeId,
								endpoint,
							) => {
								return props.saveAssociation(nodeId, assoc, {
									sourceEndpoint,
									group,
									nodeId: targetNodeId,
									endpoint,
								});
							}}
							delete={() => {
								return props.deleteAssociation(nodeId, assoc);
							}}
						/>
					))
				) : (
					<></>
				)}
				{/* Empty row to add new associations */}
				<AssociationRow
					endpoints={sourceEndpoints ?? []}
					groups={groups}
					nodes={props.nodes.filter((n) => n.nodeId !== nodeId)}
					sourceEndpoint={undefined}
					group={undefined}
					nodeId={undefined}
					supportsMultiChannel={supportsMultiChannel}
					save={(sourceEndpoint, group, targetNodeId, endpoint) => {
						return props.saveAssociation(nodeId, undefined, {
							sourceEndpoint,
							group,
							nodeId: targetNodeId,
							endpoint,
						});
					}}
				/>
			</TableBody>
		</Table>
	);
}

export interface AssociationNodeTableProps {
	nodes: {
		nodeId: number;
		endpointIndizes?: number[];
	}[];
	device: Device;
	saveAssociation(
		nodeId: number,
		prev: AssociationDefinition | undefined,
		current: AssociationDefinition,
	): Promise<void>;
	deleteAssociation(
		nodeId: number,
		association: AssociationDefinition,
	): Promise<void>;
}

export const AssociationNodeTable: React.FC<AssociationNodeTableProps> = (
	props,
) => {
	const { ready, endpoints } = props.device;

	const hasSomeAssociationGroups =
		!!endpoints &&
		[...endpoints.values()].some((e) => !!e.associationGroups);

	const classes = useStyles();

	if (ready && !hasSomeAssociationGroups) {
		// This node doesn't support associations
		return <React.Fragment></React.Fragment>;
	}

	return (
		<Paper className={classes.paper} elevation={2}>
			<AssociationNodeTableHeadline device={props.device} />
			{ready ? (
				<AssociationNodeTableContent {...props} />
			) : (
				<NodeNotReady />
			)}
		</Paper>
	);
};
