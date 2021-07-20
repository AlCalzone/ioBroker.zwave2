import * as React from "react";
import type { AssociationGroup } from "zwave-js/CommandClass";
import { Dropdown } from "./dropdown";
import { composeObject } from "alcalzone-shared/objects";
import { padStart } from "alcalzone-shared/strings";

export interface AssociationRowProps {
	// The existing endpoints on the source node, their defined groups, and existing nodes including endpoints
	endpoints: number[];
	groups: ReadonlyMap<number, (AssociationGroup & { group: number })[]>;
	nodes: { nodeId: number; endpointIndizes?: number[] }[];

	// The selected association
	sourceEndpoint: number;
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

export const AssociationRow: React.FC<AssociationRowProps> = (props) => {
	const [sourceEndpoint, setSourceEndpoint] = React.useState(
		props.sourceEndpoint,
	);
	const [group, setGroup] = React.useState(props.group);
	const [nodeId, setNodeId] = React.useState(props.nodeId);
	const [endpoint, setEndpoint] = React.useState(props.endpoint);
	const [endpointOptions, setEndpointOptions] = React.useState<
		Record<string, any>
	>({ undefined: _("Root device") });
	const [sourceEndpointOptions, setSourceEndpointOptions] = React.useState<
		Record<string, any>
	>({ 0: _("Root device") });

	const [isValid, setValid] = React.useState(false);
	const [hasChanges, setHasChanges] = React.useState(false);
	const [isBusy, setBusy] = React.useState(false);

	const groups = props.groups.get(sourceEndpoint) ?? [];

	React.useEffect(() => {
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

	const groupOptions = composeObject(
		groups.map(({ group, label }) => [
			group as any,
			`${_("Group")} ${group}: ${label}`,
		]),
	);

	const nodesOptions = composeObject(
		props.nodes.map(({ nodeId }) => [
			nodeId as any,
			`${_("Node")} ${padStart(nodeId.toString(), 3, "0")}`,
		]),
	);

	// Update the source endpoint dropdown when necessary
	React.useEffect(() => {
		const newEndpointOptions = {
			0: _("Root device"),
		};
		for (const ep of props.endpoints) {
			// The source endpoint does not distinguish between no endpoint and root device
			if (ep === 0) continue;
			newEndpointOptions[ep] = `${_("Endpoint")} ${ep}`;
		}
		setSourceEndpointOptions(newEndpointOptions);
	}, [props.endpoints]);

	// Update the target endpoint dropdown when necessary
	React.useEffect(() => {
		const endpointIndizes =
			props.nodes.find((n) => n.nodeId === nodeId)?.endpointIndizes ?? [];
		// The endpoint indizes don't include the root endpoint, so we need to add it manually
		if (!endpointIndizes.includes(0)) endpointIndizes.unshift(0);
		const groupSupportsMultiChannel = !!groups.find(
			(g) => g.group === group,
		)?.multiChannel;
		if (!groupSupportsMultiChannel) {
			setEndpointOptions({});
			return;
		} else {
			const newEndpointOptions = {
				undefined: _("Root device"),
			};
			for (const ep of endpointIndizes) {
				newEndpointOptions[ep] =
					ep === 0 ? _("Root endpoint") : `${_("Endpoint")} ${ep}`;
			}
			setEndpointOptions(newEndpointOptions);
		}
	}, [nodeId, group]);

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
				`The association could not be saved! Reason: ${e.message}`,
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
				`The association could not be deleted! Reason: ${e.message}`,
			);
			resetAssociation();
		} finally {
			setBusy(false);
		}
	}

	const currentGroup = groups.find((g) => g.group === group);
	const endpointSupportsMultiChannel = groups.some((g) => g.multiChannel);

	return (
		<tr>
			<td>
				<Dropdown
					id="sourceEndpoints"
					options={sourceEndpointOptions}
					checkedOption={sourceEndpoint.toString()}
					emptySelectionText={_("- select endpoint -")}
					checkedChanged={(newValue) => {
						setSourceEndpoint(parseInt(newValue));
					}}
				/>
			</td>
			<td>
				<Dropdown
					id="groups"
					options={groupOptions}
					checkedOption={group?.toString()}
					emptySelectionText={_("- select group -")}
					checkedChanged={(newValue) => {
						setGroup(parseInt(newValue));
					}}
				/>
			</td>
			<td>
				<Dropdown
					id="nodes"
					options={nodesOptions}
					checkedOption={nodeId?.toString()}
					emptySelectionText={_("- select node -")}
					checkedChanged={(newValue) => {
						setNodeId(parseInt(newValue));
					}}
				/>
			</td>
			<td
				style={{
					display: endpointSupportsMultiChannel ? "initial" : "none",
				}}
			>
				<div
					style={{
						display: currentGroup?.multiChannel
							? "initial"
							: "none",
					}}
				>
					<Dropdown
						id="endpoints"
						key="endpoints"
						options={endpointOptions}
						checkedOption={String(endpoint)}
						emptySelectionText={_("- select endpoint -")}
						checkedChanged={(newValue) => {
							setEndpoint(
								newValue === "undefined"
									? undefined
									: parseInt(newValue),
							);
						}}
					/>
				</div>
			</td>
			<td>
				<a
					className={`btn ${
						isBusy || !isValid || !hasChanges ? "disabled" : ""
					}`}
					title={_("Save association")}
					onClick={saveAssociation}
				>
					<i className="material-icons">
						{isNewAssociation ? "add" : "save"}
					</i>
				</a>
				&nbsp;
				<a
					className={`btn ${isBusy || !hasChanges ? "disabled" : ""}`}
					title={_("Undo changes")}
					onClick={resetAssociation}
				>
					<i className="material-icons">restore</i>
				</a>
				&nbsp;
				{!isNewAssociation && (
					<a
						className={`btn red ${isBusy ? "disabled" : ""}`}
						title={_("Delete association")}
						onClick={deleteAssociation}
					>
						<i className="material-icons">delete_forever</i>
					</a>
				)}
			</td>
		</tr>
	);
};
