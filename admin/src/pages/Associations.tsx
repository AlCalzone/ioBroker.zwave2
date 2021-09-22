import React from "react";
import type { AssociationDefinition } from "../../../src/lib/shared";
import { AssociationNodeTable } from "../components/AssociationNodeTable";
import { NoDevices, NotRunning } from "../components/Messages";
import { useAdapter } from "iobroker-react/hooks";
import { Device, useAPI } from "../lib/useAPI";
import CircularProgress from "@material-ui/core/CircularProgress";

export interface AssociationsProps {
	devices: Record<number, Device> | undefined;
	updateDevices: () => Promise<void>;
}

export const Associations: React.FC<AssociationsProps> = (props) => {
	const { alive: adapterRunning, connected: driverReady } = useAdapter();
	const api = useAPI();
	const { devices, updateDevices } = props;

	async function saveAssociation(
		nodeId: number,
		prev: AssociationDefinition | undefined,
		current: AssociationDefinition,
	): Promise<void> {
		if (prev) await deleteAssociation(nodeId, prev);
		await api.addAssociation(nodeId, current);
		// Associations are not reflected in states, so we need to
		// manually update them
		await updateDevices();
	}

	async function deleteAssociation(
		nodeId: number,
		association: AssociationDefinition,
	): Promise<void> {
		await api.removeAssociation(nodeId, association);
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
	const nonControllerDevices = devicesAsArray.filter(
		(d) => !d.value.native.isControllerNode,
	);

	if (!adapterRunning || !driverReady) return <NotRunning />;
	if (!devices) return <CircularProgress />;
	if (!nonControllerDevices.length) return <NoDevices />;

	return (
		<>
			{nonControllerDevices.map((device, index) => (
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
