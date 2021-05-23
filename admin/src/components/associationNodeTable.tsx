import { padStart } from "alcalzone-shared/strings";
import * as React from "react";
import type { AssociationGroup } from "zwave-js";
import type { AssociationDefinition } from "../../../src/lib/shared";
import type { Device } from "../lib/backend";
import { statusToCssClass, statusToIconName } from "../lib/shared";
import { AssociationRow } from "./associationRow";
import { NodeNotReady } from "./messages";

interface AssociationNodeTableHeadlineProps {
	device: Device;
}

function AssociationNodeTableHeadline(
	props: AssociationNodeTableHeadlineProps,
) {
	const { value, status } = props.device;
	const nodeId = value.native.id as number;
	const nodeName =
		value.common.name && !(value.common.name as string).startsWith("Node")
			? value.common.name
			: undefined;
	return (
		<hgroup>
			<h5>
				{_("Node")} {padStart(nodeId.toString(), 3, "0")}&nbsp;
				<i
					className={`material-icons ${statusToCssClass(status)}`}
					title={_(status ?? "unknown")}
				>
					{statusToIconName(status)}
				</i>
			</h5>
			{nodeName && <h6>{nodeName}</h6>}
		</hgroup>
	);
}

function AssociationNodeTableContent(props: AssociationNodeTableProps) {
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
		<table>
			<thead>
				<tr>
					<td>{_("Source endpoint")}</td>
					<td>{_("Group")}</td>
					<td>{_("Target node")}</td>
					{supportsMultiChannel && <td>{_("Target endpoint")}</td>}
					<td>&nbsp;</td>
				</tr>
			</thead>
			<tbody>
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
					sourceEndpoint={0}
					group={undefined}
					nodeId={undefined}
					save={(sourceEndpoint, group, targetNodeId, endpoint) => {
						return props.saveAssociation(nodeId, undefined, {
							sourceEndpoint,
							group,
							nodeId: targetNodeId,
							endpoint,
						});
					}}
				/>
			</tbody>
		</table>
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

	if (ready && !hasSomeAssociationGroups) {
		// This node doesn't support associations
		return <React.Fragment></React.Fragment>;
	}

	return (
		<React.Fragment>
			<div className="section">
				<AssociationNodeTableHeadline device={props.device} />
				{ready ? (
					<AssociationNodeTableContent {...props} />
				) : (
					<NodeNotReady />
				)}
			</div>
			<div className="divider"></div>
		</React.Fragment>
	);
};
