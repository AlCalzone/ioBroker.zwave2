import { entries } from "alcalzone-shared/objects";
import { padStart } from "alcalzone-shared/strings";
import type { CommandClasses } from "zwave-js/CommandClass";
import { BasicDeviceClasses, NodeStatus, ZWaveNode } from "zwave-js/Node";
import type {
	TranslatedValueID,
	ValueMetadataNumeric,
	ValueType,
	ZWaveNodeMetadataUpdatedArgs,
	ZWaveNodeValueAddedArgs,
	ZWaveNodeValueRemovedArgs,
	ZWaveNodeValueUpdatedArgs,
} from "zwave-js/Values";
import { Global as _ } from "./global";
import { computeDeviceId } from "./shared";

type ZWaveNodeArgs =
	| ZWaveNodeValueAddedArgs
	| ZWaveNodeValueUpdatedArgs
	| ZWaveNodeValueRemovedArgs
	| ZWaveNodeMetadataUpdatedArgs;

export function nodeStatusToStatusState(status: NodeStatus): string {
	switch (status) {
		case NodeStatus.Awake:
			return "awake";
		case NodeStatus.Asleep:
			return "asleep";
		case NodeStatus.Dead:
			return "dead";
		case NodeStatus.Unknown:
			return "unknown";
	}
}

const isCamelCasedSafeNameRegex = /^(?!.*[\-_]$)[a-z]([a-zA-Z0-9\-_]+)$/;

/** Converts a device label to a valid filename */
export function nameToStateId(label: string): string {
	if (isCamelCasedSafeNameRegex.test(label)) return label;
	let safeName = label;
	// Since these rules influence each other, we need to do multiple passes
	while (true) {
		let replaced = safeName;
		// Remove trailing, leading and multiple whitespace
		replaced = replaced.trim();
		replaced = replaced.replace(/\s+/g, " ");
		// Replace all unsafe chars
		replaced = replaced.replace(/[^a-zA-Z0-9\-_ ]+/g, "_");
		// Replace spaces surrounded by unsafe chars with a space
		replaced = replaced.replace(/_\s/g, " ");
		replaced = replaced.replace(/\s_/g, " ");
		// Remove trailing and leading dashes and underscores
		replaced = replaced.replace(/^_\s*/, "");
		replaced = replaced.replace(/\s*_$/, "");
		// If nothing changed, we're done
		if (safeName === replaced) break;
		// Otherwise remember the intermediate result for the next pass
		safeName = replaced;
	}
	return camelCase(safeName);
}

function camelCase(str: string): string {
	return str
		.split(" ")
		.map((substr, i) =>
			i === 0
				? substr.toLowerCase()
				: substr[0].toUpperCase() + substr.slice(1).toLowerCase(),
		)
		.join("");
}

export function ccNameToChannelIdFragment(ccName: string): string {
	return ccName.replace(/[\s]+/g, "_");
}

export function computeChannelId(nodeId: number, ccName: string): string {
	return `${computeDeviceId(nodeId)}.${ccNameToChannelIdFragment(ccName)}`;
}

export function computeId(nodeId: number, args: TranslatedValueID): string {
	return [
		computeDeviceId(nodeId),
		ccNameToChannelIdFragment(args.commandClassName),
		[
			args.propertyName?.trim() && nameToStateId(args.propertyName),
			args.endpoint && padStart(args.endpoint.toString(), 3, "0"),
			args.propertyKeyName?.trim() && nameToStateId(args.propertyKeyName),
		]
			.filter((s) => !!s)
			.join("_"),
	].join(".");
}

function nodeToNative(node: ZWaveNode): Record<string, any> {
	return {
		id: node.id,
		manufacturerId: node.manufacturerId,
		productType: node.productType,
		productId: node.productId,
		...(node.deviceClass && {
			type: {
				basic: BasicDeviceClasses[node.deviceClass.basic],
				generic: node.deviceClass.generic.name,
				specific: node.deviceClass.specific.name,
			},
		}),
		endpoints: node.getEndpointCount(),
		secure: node.isSecure,
	};
}

function nodeToCommon(node: ZWaveNode): ioBroker.DeviceCommon {
	return {
		name: node.deviceConfig
			? `${node.deviceConfig.manufacturer} ${node.deviceConfig.label}`
			: `Node ${padStart(node.id.toString(), 3, "0")}`,
	};
}

const fallbackNodeNameRegex = /^Node \d+$/;

export async function extendNode(node: ZWaveNode): Promise<void> {
	const deviceId = computeDeviceId(node.id);
	const originalObject = _.adapter.oObjects[
		`${_.adapter.namespace}.${deviceId}`
	] as ioBroker.DeviceObject | undefined;

	// update the object while preserving the existing common properties
	const nodeCommon = nodeToCommon(node);
	// Overwrite empty names and placeholder/fallback names
	let newName = originalObject?.common.name;
	newName =
		newName && !fallbackNodeNameRegex.test(newName)
			? newName
			: nodeCommon.name;

	const desiredObject: ioBroker.SettableObject = {
		type: "device",
		common: {
			...nodeCommon,
			...originalObject?.common,
			name: newName,
		},
		native: nodeToNative(node),
	};

	// check if we have to update anything
	if (
		originalObject == undefined ||
		JSON.stringify(originalObject.common) !==
			JSON.stringify(desiredObject.common) ||
		JSON.stringify(originalObject.native) !==
			JSON.stringify(desiredObject.native)
	) {
		await _.adapter.setObjectAsync(deviceId, desiredObject);
	}
}

/** Removed all objects that belong to a node */
export async function removeNode(nodeId: number): Promise<void> {
	const deviceId = `${_.adapter.namespace}.${computeDeviceId(nodeId)}`;
	try {
		await _.adapter.delForeignObjectAsync(deviceId);
	} catch (e) {
		/* ok */
	}

	// Find all channel and state objects so we can delete them
	const existingObjs = {
		...(await _.$$(`${deviceId}.*`, { type: "channel" })),
		...(await _.$$(`${deviceId}.*`, { type: "state" })),
	};

	for (const [id, obj] of entries(existingObjs)) {
		if (obj.type === "state") {
			try {
				await _.adapter.delForeignStateAsync(id);
			} catch (e) {
				/* ok */
			}
		}
		try {
			await _.adapter.delForeignObjectAsync(id);
		} catch (e) {
			/* ok */
		}
	}
}

export async function extendCC(
	node: ZWaveNode,
	cc: CommandClasses,
	ccName: string,
): Promise<void> {
	const channelId = computeChannelId(node.id, ccName);
	const common = {
		name: ccName,
	};
	const native = {
		cc,
		version: node.getCCVersion(cc),
	};

	const originalObject =
		_.adapter.oObjects[`${_.adapter.namespace}.${channelId}`];
	if (originalObject == undefined) {
		await _.adapter.setObjectAsync(channelId, {
			type: "channel",
			common,
			native,
		});
	} else if (
		JSON.stringify(common) !== JSON.stringify(originalObject.common) ||
		JSON.stringify(native) !== JSON.stringify(originalObject.native)
	) {
		await _.adapter.extendObjectAsync(channelId, {
			common,
			native,
		});
	}
}

export async function extendValue(
	node: ZWaveNode,
	args: ZWaveNodeValueAddedArgs | ZWaveNodeValueUpdatedArgs,
): Promise<void> {
	const stateId = computeId(node.id, args);

	await extendMetadata(node, args);
	try {
		await _.adapter.setStateAsync(stateId, {
			val: (args.newValue ?? null) as any,
			ack: true,
		});
	} catch (e) {
		_.adapter.log.error(`Cannot set state "${stateId}" in ioBroker: ${e}`);
	}
}

export async function extendMetadata(
	node: ZWaveNode,
	args: ZWaveNodeArgs,
): Promise<void> {
	const stateId = computeId(node.id, args);
	const metadata =
		("metadata" in args && args.metadata) || node.getValueMetadata(args);

	const objectDefinition: ioBroker.SettableObjectWorker<ioBroker.StateObject> = {
		type: "state",
		common: {
			role: "value", // TODO: Determine based on the CC type
			read: metadata.readable,
			write: metadata.writeable,
			name: metadata.label
				? `${metadata.label}${
						args.endpoint ? ` (Endpoint ${args.endpoint})` : ""
				  }`
				: stateId,
			desc: metadata.description,
			type: valueTypeToIOBrokerType(metadata.type),
			min: (metadata as ValueMetadataNumeric).min,
			max: (metadata as ValueMetadataNumeric).max,
			def: (metadata as ValueMetadataNumeric).default,
			unit: (metadata as ValueMetadataNumeric).unit,
			states: (metadata as any).states,
		},
		native: {
			nodeId: node.id,
			valueId: {
				commandClass: args.commandClass,
				endpoint: args.endpoint,
				property: args.property,
				propertyKey: args.propertyKey,
			},
			steps: (metadata as ValueMetadataNumeric).steps,
		} as any,
	};

	const originalObject =
		_.adapter.oObjects[`${_.adapter.namespace}.${stateId}`];
	if (originalObject == undefined) {
		await _.adapter.setObjectAsync(stateId, objectDefinition);
	} else if (
		JSON.stringify(objectDefinition.common) !==
			JSON.stringify(originalObject.common) ||
		JSON.stringify(objectDefinition.native) !==
			JSON.stringify(originalObject.native)
	) {
		await _.adapter.extendObjectAsync(stateId, objectDefinition);
	}
}

export async function removeValue(
	nodeId: number,
	args: ZWaveNodeValueRemovedArgs,
): Promise<void> {
	const stateId = computeId(nodeId, args);
	await _.adapter.delObjectAsync(stateId);
}

function valueTypeToIOBrokerType(
	valueType: ValueType,
): ioBroker.StateCommon["type"] {
	switch (valueType) {
		case "number":
		case "boolean":
		case "string":
			return valueType;
		case "any":
			return "mixed";
		default:
			if (valueType.endsWith("[]")) return "array";
	}
	return "mixed";
}

export async function setNodeStatus(
	nodeId: number,
	status: string,
): Promise<void> {
	const stateId = `${computeDeviceId(nodeId)}.status`;
	await _.adapter.setObjectNotExistsAsync(stateId, {
		type: "state",
		common: {
			name: "Node status",
			role: "indicator",
			type: "string",
			read: true,
			write: false,
		},
		native: {},
	});
	await _.adapter.setStateAsync(stateId, status, true);
}

/** Updates the ready state for the given node */
export async function setNodeReady(
	nodeId: number,
	ready: boolean,
): Promise<void> {
	const stateId = `${computeDeviceId(nodeId)}.ready`;
	await _.adapter.setObjectNotExistsAsync(stateId, {
		type: "state",
		common: {
			name: "Ready to use",
			role: "indicator",
			type: "boolean",
			read: true,
			write: false,
			def: false,
		},
		native: {},
	});
	await _.adapter.setStateAsync(stateId, ready, true);
}
