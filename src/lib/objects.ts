import { padStart } from "alcalzone-shared/strings";
import {
	ZWaveNode,
	ZWaveNodeValueAddedArgs,
	ZWaveNodeValueRemovedArgs,
	ZWaveNodeValueUpdatedArgs,
} from "zwave-js/build/lib/node/Node";
import { Global as _ } from "./global";
import { isArray, isObject } from "./tools";

type ZWaveNodeArgs =
	| ZWaveNodeValueAddedArgs
	| ZWaveNodeValueUpdatedArgs
	| ZWaveNodeValueRemovedArgs;

export function computeId(nodeId: number, args: ZWaveNodeArgs): string {
	return [
		`Node_${padStart(nodeId.toString(), 3, "0")}`,
		args.commandClassName.replace(/[\s]+/g, "_"),
		[
			args.endpoint &&
				`Endpoint_${padStart(args.endpoint.toString(), 2, "0")}`,
			args.propertyName,
			args.propertyKey,
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
	const metadata = node.getValueMetadata(
		args.commandClass,
		args.endpoint || 0,
		args.propertyName,
		args.propertyKey,
	);

	// Create object if it doesn't exist
	const objectDefinition: ioBroker.SettableObjectWorker<
		ioBroker.StateObject
	> = {
		type: "state",
		common: {
			role: "value", // TODO: Determine based on the CC type
			read: metadata.readable,
			write: metadata.writeable,
			name: metadata.label || stateId,
			desc: metadata.description,
			type: getCommonType(args.newValue),
		},
		native: {},
	};
	if ("min" in metadata) objectDefinition.common.min = metadata.min;
	if ("max" in metadata) objectDefinition.common.max = metadata.max;

	await _.adapter.setObjectNotExistsAsync(stateId, objectDefinition);
	await _.adapter.setStateAsync(stateId, args.newValue as any, true);
}

export async function removeValue(
	nodeId: number,
	args: ZWaveNodeValueRemovedArgs,
): Promise<void> {
	const stateId = computeId(nodeId, args);
	await _.adapter.delObjectAsync(stateId);
}

function getCommonType(value: unknown): ioBroker.StateCommon["type"] {
	if (typeof value === "number") return "number";
	if (typeof value === "boolean") return "boolean";
	if (typeof value === "string") return "string";
	if (isArray(value)) return "array";
	if (isObject(value)) return "object";
	return "mixed";
}
