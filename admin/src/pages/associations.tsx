import * as React from "react";
import type { AssociationDefinition } from "../../../src/lib/shared";
import { AssociationNodeTable } from "../components/associationNodeTable";
import { NoDevices, NotRunning } from "../components/messages";
import { addAssociation, removeAssociation } from "../lib/backend";
import { AdapterContext } from "../lib/useAdapter";
import { DevicesContext } from "../lib/useDevices";

export const Associations: React.FC = () => {
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
		endpointIndizes: d.value.native.endpointIndizes as number[] | undefined,
	}));

	if (!(adapterRunning && driverReady)) return <NotRunning />;
	if (!devicesAsArray.length) return <NoDevices />;

	return (
		<>
			{devicesAsArray.map((device, index) => (
				<AssociationNodeTable
					key={index}
					device={device}
					nodes={nodes}
					saveAssociation={saveAssociation}
					deleteAssociation={deleteAssociation}
				/>
			))}
		</>
	);
};
