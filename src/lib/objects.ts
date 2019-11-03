import { padStart } from "alcalzone-shared/strings";
import {
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

export function computeId(nodeId: number, args: ZWaveNodeArgs): string {
	return [
		`Node_${padStart(nodeId.toString(), 3, "0")}`,
		args.commandClassName.replace(/[\s]+/g, "_"),
		[
			args.propertyName,
			args.endpoint && padStart(args.endpoint.toString(), 3, "0"),
			args.propertyKeyName && args.propertyKeyName.replace(/[\s]+/g, "_"),
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

	const objectDefinition: ioBroker.SettableObjectWorker<
		ioBroker.StateObject
	> = {
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
				propertyName: args.propertyName,
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
