import * as React from "react";
import type { AssociationGroup } from "zwave-js/CommandClass";
import { Dropdown } from "./dropdown";
import { composeObject } from "alcalzone-shared/objects";
import { padStart } from "alcalzone-shared/strings";

export interface Association {}

export interface AssociationRowProps {
	// The defined groups and nodes including endpoints
	groups: (AssociationGroup & { groupId: number })[];
	nodes: { nodeId: number; endpoints?: number }[];

	// The selected association
	group: number | undefined;
	nodeId: number | undefined;
	endpoint?: number | undefined;

	// Will be called when the group should be saved
	save(
		group: number,
		nodeId: number,
		endpoint?: number | undefined,
	): Promise<void>;
	// Will be called when the group should be deleted
	delete?(): Promise<void>;
}

export function AssociationRow(props: AssociationRowProps) {
	const [group, setGroup] = React.useState(props.group);
	const [nodeId, setNodeId] = React.useState(props.nodeId);
	const [endpoint, setEndpoint] = React.useState(props.endpoint);
	const [endpointOptions, setEndpointOptions] = React.useState<
		Record<string, any>
	>({ undefined: _("Root device") });

	const [isValid, setValid] = React.useState(false);
	const [hasChanges, setHasChanges] = React.useState(false);
	const [isBusy, setBusy] = React.useState(false);

	React.useEffect(() => {
		setHasChanges(
			group !== props.group ||
				nodeId !== props.nodeId ||
				endpoint !== props.endpoint,
		);
		setValid(
			!!props.groups.find((g) => g.groupId === group) &&
				!!props.nodes.find((n) => n.nodeId === nodeId) &&
				(props.nodes.find((n) => n.nodeId === nodeId)!.endpoints ??
					0) >= (endpoint ?? 0),
		);
	}, [group, nodeId, endpoint]);

	const groupOptions = composeObject(
		props.groups.map(({ groupId, label }) => [
			groupId as any,
			`${_("Group")} ${groupId}: ${label}`,
		]),
	);

	const nodesOptions = composeObject(
		props.nodes.map(({ nodeId }) => [
			nodeId as any,
			`${_("Node")} ${padStart(nodeId.toString(), 3, "0")}`,
		]),
	);

	React.useEffect(() => {
		const numEndpoints =
			props.nodes.find((n) => n.nodeId === nodeId)?.endpoints ?? 0;
		const groupSupportsMultiChannel = !!props.groups.find(
			(g) => g.groupId === group,
		)?.multiChannel;
		if (!groupSupportsMultiChannel) {
			setEndpointOptions({});
			return;
		} else {
			const newEndpointOptions = {
				undefined: _("Root device"),
			};
			for (let ep = 0; ep <= numEndpoints; ep++) {
				newEndpointOptions[ep] =
					ep === 0 ? _("Root endpoint") : `${_("Endpoint")} ${ep}`;
			}
			setEndpointOptions(newEndpointOptions);
		}
	}, [nodeId, group]);

	const isNewAssociation =
		props.group == undefined &&
		props.nodeId == undefined &&
		props.endpoint == undefined;

	async function saveAssociation() {
		try {
			setBusy(true);
			await props.save(group!, nodeId!, endpoint);
			if (isNewAssociation) resetAssociation();
		} catch (e) {
			alert(_(`The association could not be saved!`));
			resetAssociation();
		} finally {
			setBusy(false);
		}
	}
	function resetAssociation() {
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
			resetAssociation();
		} finally {
			setBusy(false);
		}
	}

	const currentGroup = props.groups.find((g) => g.groupId === group);
	const nodeSupportsMultiChannel = props.groups.some((g) => g.multiChannel);

	return (
		<tr>
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
					display: nodeSupportsMultiChannel ? "initial" : "none",
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
}
