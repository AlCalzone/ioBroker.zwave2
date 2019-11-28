import { padStart } from "alcalzone-shared/strings";
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

/** Converts a device label to a valid filename */
export function nameToStateId(label: string): string {
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
		// Remove trailing and leading underscores
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

export function computeId(nodeId: number, args: TranslatedValueID): string {
	return [
		computeDeviceId(nodeId),
		args.commandClassName.replace(/[\s]+/g, "_"),
		[
			args.propertyName?.trim() && nameToStateId(args.propertyName),
			args.endpoint && padStart(args.endpoint.toString(), 3, "0"),
			args.propertyKeyName?.trim() && nameToStateId(args.propertyKeyName),
		]
			.filter(s => !!s)
			.join("_"),
	].join(".");
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
