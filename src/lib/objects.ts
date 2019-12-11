import { padStart } from "alcalzone-shared/strings";
import { CommandClasses } from "zwave-js/build/lib/commandclass/CommandClasses";
import { BasicDeviceClasses } from "zwave-js/build/lib/node/DeviceClass";
import {
	TranslatedValueID,
	ZWaveNode,
	ZWaveNodeMetadataUpdatedArgs,
	ZWaveNodeValueAddedArgs,
	ZWaveNodeValueRemovedArgs,
	ZWaveNodeValueUpdatedArgs,
} from "zwave-js/build/lib/node/Node";
import {
	ValueMetadataNumeric,
	ValueType,
} from "zwave-js/build/lib/values/Metadata";
import { Global as _ } from "./global";

type ZWaveNodeArgs =
	| ZWaveNodeValueAddedArgs
	| ZWaveNodeValueUpdatedArgs
	| ZWaveNodeValueRemovedArgs
	| ZWaveNodeMetadataUpdatedArgs;

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

/** Returns the id of the device object for the given node id */
export function computeDeviceId(nodeId: number): string {
	return `Node_${padStart(nodeId.toString(), 3, "0")}`;
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
			.filter(s => !!s)
			.join("_"),
	].join(".");
}

function nodeToNative(node: ZWaveNode): ioBroker.Object["native"] {
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
	};
}

function nodeToCommon(node: ZWaveNode): ioBroker.ObjectCommon {
	return {
		name: node.deviceConfig
			? `${node.deviceConfig.manufacturer} ${node.deviceConfig.label}`
			: `Node ${padStart(node.id.toString(), 3, "0")}`,
	};
}

export async function extendNode(node: ZWaveNode): Promise<void> {
	const deviceId = computeDeviceId(node.id);
	const common = nodeToCommon(node);
	const native = nodeToNative(node);

	const originalObject = await _.adapter.getObjectAsync(deviceId);
	if (originalObject == undefined) {
		await _.adapter.setObjectAsync(deviceId, {
			type: "device",
			common,
			native,
		});
	} else if (
		JSON.stringify(common) !== JSON.stringify(originalObject.common) ||
		JSON.stringify(native) !== JSON.stringify(originalObject.native)
	) {
		await _.adapter.extendObjectAsync(deviceId, {
			common,
			native,
		});
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

	const originalObject = await _.adapter.getObjectAsync(channelId);
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
	await _.adapter.setStateAsync(stateId, args.newValue as any, true);
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
		},
	};

	// FIXME: Only set the object when it changed
	await _.adapter.setObjectAsync(stateId, objectDefinition);
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
