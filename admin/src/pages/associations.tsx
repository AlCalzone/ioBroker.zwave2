import * as React from "react";
import type { AssociationDefinition } from "../../../src/lib/shared";
import { AssociationRow } from "../components/associationRow";
import { NotRunning } from "../components/notRunning";
import { addAssociation, removeAssociation } from "../lib/backend";
import { statusToCssClass, statusToIconName } from "../lib/shared";
import { AdapterContext } from "../lib/useAdapter";
import { DevicesContext } from "../lib/useDevices";

export function Associations() {
	const { devices, updateDevices } = React.useContext(DevicesContext);
	const { alive: adapterRunning, connected: driverReady } = React.useContext(
		AdapterContext,
	);

	async function saveAssociation(
		nodeId: number,
		prev: AssociationDefinition | undefined,
		current: AssociationDefinition,
	): Promise<void> {
		if (prev) await deleteAssociation(nodeId, prev);
		await addAssociation(nodeId, current);
		// Associations are not reflected in states, so we need to
		// manually update them
		await updateDevices();
	}

	async function deleteAssociation(
		nodeId: number,
		association: AssociationDefinition,
	): Promise<void> {
		await removeAssociation(nodeId, association);
		// Associations are not reflected in states, so we need to
		// manually update them
		await updateDevices();
	}

	const devicesAsArray = devices
		? Object.values(devices).filter(Boolean)
		: [];
	const nodes = devicesAsArray.map((d) => ({
		nodeId: d.value.native.id as number,
		endpoints: d.value.native.endpoints as number | undefined,
	}));

	return adapterRunning && driverReady ? (
		<>
			{devicesAsArray.length ? (
				devicesAsArray.map(
					(
						{
							value,
							ready,
							status,
							associationGroups,
							associations,
						},
						index,
					) => {
						if (ready && !associationGroups) {
							// This node doesn't support associations
							return (
								<React.Fragment key={index}></React.Fragment>
							);
						}

						const associationsAsArray = (associations
							? Object.entries(associations)
									.map(([group, assocs]) =>
										assocs.map((a) => ({
											group: parseInt(group),
											...a,
										})),
									)
									.reduce((acc, cur) => [...acc, ...cur], [])
							: []
						).sort((a1, a2) => {
							return (
								a1.group - a2.group ||
								a1.nodeId - a2.nodeId ||
								(a1.endpoint ?? 0) - (a2.endpoint ?? 0)
							);
						});
						const groupsAsArray = associationGroups
							? Object.entries(associationGroups).map(
									([group, def]) => ({
										groupId: parseInt(group),
										...def,
									}),
							  )
							: [];

						if (associationGroups) {
							console.warn(JSON.stringify(associationGroups));
						}
						const supportsMultiChannel = associationGroups
							? Object.values(associationGroups).some(
									(a) => !!a.multiChannel,
							  )
							: false;
						const hasAssociations = associations
							? Object.keys(associations).length > 0
							: false;

						const nodeId = value.native.id as number;
						return (
							<React.Fragment key={index}>
								<div className="section" key={`node${nodeId}`}>
									<h5>
										Node {nodeId}{" "}
										{/* Whether the device is reachable */}
										<i
											className={`material-icons ${statusToCssClass(
												status,
											)}`}
											title={_(status ?? "unknown")}
										>
											{statusToIconName(status)}
										</i>
									</h5>
									{ready ? (
										<table>
											<thead>
												<tr>
													<td>{_("Group")}</td>
													<td>{_("Target node")}</td>
													{supportsMultiChannel && (
														<td>
															{_(
																"Target endpoint",
															)}
														</td>
													)}
													<td>&nbsp;</td>
												</tr>
											</thead>
											<tbody>
												{hasAssociations ? (
													associationsAsArray.map(
														(assoc, i) => (
															<AssociationRow
																key={`from${nodeId}-to${
																	assoc.group
																}-${
																	assoc.nodeId
																}-${
																	assoc.endpoint ??
																	0
																}`}
																groups={
																	groupsAsArray
																}
																nodes={nodes.filter(
																	(n) =>
																		n.nodeId !==
																		nodeId,
																)}
																{...assoc}
																save={(
																	group,
																	targetNodeId,
																	endpoint,
																) => {
																	return saveAssociation(
																		nodeId,
																		{
																			groupId:
																				assoc.group,
																			targetNodeId:
																				assoc.nodeId,
																			endpoint:
																				assoc.endpoint,
																		},
																		{
																			groupId: group,
																			targetNodeId,
																			endpoint,
																		},
																	);
																}}
																delete={() => {
																	return deleteAssociation(
																		nodeId,
																		{
																			groupId:
																				assoc.group,
																			targetNodeId:
																				assoc.nodeId,
																			endpoint:
																				assoc.endpoint,
																		},
																	);
																}}
															/>
														),
													)
												) : (
													<></>
												)}
												{/* Empty row to add new associations */}
												<AssociationRow
													groups={groupsAsArray}
													nodes={nodes.filter(
														(n) =>
															n.nodeId !== nodeId,
													)}
													group={undefined}
													nodeId={undefined}
													save={(
														group,
														targetNodeId,
														endpoint,
													) => {
														return saveAssociation(
															nodeId,
															undefined,
															{
																groupId: group,
																targetNodeId,
																endpoint,
															},
														);
													}}
												/>
											</tbody>
										</table>
									) : (
										<p style={{ textAlign: "center" }}>
											{_("Node is not ready")}
										</p>
									)}
								</div>
								<div className="divider"></div>
							</React.Fragment>
						);
					},
				)
			) : (
				<p style={{ textAlign: "center" }}>{_("No devices present")}</p>
			)}
		</>
	) : (
		<NotRunning />
	);
}
