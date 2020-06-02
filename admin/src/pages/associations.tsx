import * as React from "react";
import { NotRunning } from "../components/notRunning";
import {
	Device,
	loadDevices,
	getNodeReady,
	getAssociationGroups,
	getAssociations,
	removeAssociation,
	addAssociation,
} from "../lib/backend";
import { useStateWithRef } from "../lib/stateWithRefs";
import { AssociationRow } from "../components/associationRow";
import type { AssociationDefinition } from "../../../src/lib/shared";

let namespace: string;
const deviceIdRegex = /Node_(\d+)$/;
const deviceReadyRegex = /Node_(\d+)\.ready$/;

export function Associations() {
	const [adapterRunning, setAdapterRunning] = React.useState(false);
	const [driverReady, setDriverReady] = React.useState(false);

	// Because the useEffect callback captures stale state, we need to use a ref for all state that is required in the hook
	const [devices, devicesRef, setDevices] = useStateWithRef<
		Record<number, Device>
	>();

	React.useEffect(() => {
		namespace = `${adapter}.${instance}`;
		const adapterAliveId = `system.adapter.${namespace}.alive`;
		const driverReadyId = `${namespace}.info.connection`;
		// componentDidMount
		const onStateChange: ioBroker.StateChangeHandler = async (
			id,
			state,
		) => {
			if (!state || !state.ack) return;

			if (id.match(deviceReadyRegex)) {
				// A device's ready state was changed
				const nodeId = parseInt(deviceReadyRegex.exec(id)![1], 10);
				const updatedDevice = devicesRef.current?.[nodeId];
				if (updatedDevice && state.val !== updatedDevice.ready) {
					updatedDevice.ready = state.val as any;
					if (updatedDevice.ready) {
						// Update associations
						updatedDevice.associationGroups = await getAssociationGroups(
							nodeId,
						);
						updatedDevice.associations = await getAssociations(
							nodeId,
						);
					}
					setDevices({
						...devicesRef.current,
						[nodeId]: updatedDevice,
					});
				}
			} else if (id === adapterAliveId) {
				setAdapterRunning(!!state?.val);
			} else if (id === driverReadyId) {
				setDriverReady(!!state?.val);
			}
		};

		const onObjectChange: ioBroker.ObjectChangeHandler = async (
			id,
			obj,
		) => {
			if (!id.startsWith(namespace) || !deviceIdRegex.test(id)) return;
			if (obj) {
				// New or changed device object
				if (
					obj.type === "device" &&
					typeof obj.native.id === "number"
				) {
					const nodeId = obj.native.id;
					const device: Device = {
						id,
						value: obj,
						ready: await getNodeReady(namespace, nodeId),
					};
					if (device.ready) {
						device.associationGroups = await getAssociationGroups(
							nodeId,
						);
						device.associations = await getAssociations(nodeId);
					}
					setDevices({ ...devicesRef.current, [nodeId]: device });
				}
			} else {
				const nodeId = parseInt(deviceIdRegex.exec(id)![1], 10);
				const newDevices = { ...devicesRef.current };
				delete newDevices[nodeId];
				setDevices(newDevices);
			}
		};

		(async () => {
			setDevices(
				await loadDevices(namespace, {
					ready: true,
					associations: true,
				}),
			);

			socket.on("stateChange", onStateChange);
			socket.on("objectChange", onObjectChange);
		})();

		// componentWillUnmount
		return () => {
			socket.removeEventHandler("stateChange", onStateChange);
			socket.removeEventHandler("objectChange", onObjectChange);
		};
	}, []);

	async function saveAssociation(
		nodeId: number,
		prev: AssociationDefinition | undefined,
		current: AssociationDefinition,
	): Promise<void> {
		if (prev) await deleteAssociation(nodeId, prev);
		await addAssociation(nodeId, current);

		// Update devices
		setDevices(
			await loadDevices(namespace, {
				ready: true,
				associations: true,
			}),
		);
	}

	async function deleteAssociation(
		nodeId: number,
		association: AssociationDefinition,
	): Promise<void> {
		await removeAssociation(nodeId, association);

		// Update devices
		setDevices(
			await loadDevices(namespace, {
				ready: true,
				associations: true,
			}),
		);
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
						{ value, ready, associationGroups, associations },
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

						const supportsMultiChannel = associationGroups
							? Object.values(associationGroups)[0].multiChannel
							: false;
						const hasAssociations = associations
							? Object.keys(associations).length > 0
							: false;

						const nodeId = value.native.id as number;
						return (
							<React.Fragment key={index}>
								<div className="section" key={`node${nodeId}`}>
									<h5>Node {nodeId}</h5>
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
