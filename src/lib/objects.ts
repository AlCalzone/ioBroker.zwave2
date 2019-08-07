import { padStart } from "alcalzone-shared/strings";
import {
	ZWaveNodeValueAddedArgs,
	ZWaveNodeValueRemovedArgs,
	ZWaveNodeValueUpdatedArgs,
} from "zwave-js/build/lib/node/Node";
import { Global as _ } from "./global";

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
	nodeId: number,
	args: ZWaveNodeValueAddedArgs | ZWaveNodeValueUpdatedArgs,
): Promise<void> {
	const stateId = computeId(nodeId, args);
	// Create object if it doesn't exist
	await _.adapter.setObjectNotExistsAsync(stateId, {
		type: "state",
		common: {
			role: "value", // TODO: Determine based on the CC type
			read: true,
			write: true,
			name: stateId, // TODO: Give a useful name
		},
		native: {},
	});
	// Update value
	await _.adapter.setStateAsync(stateId, args.newValue as any, true);
}

export async function removeValue(
	nodeId: number,
	args: ZWaveNodeValueRemovedArgs,
): Promise<void> {
	const stateId = computeId(nodeId, args);
	await _.adapter.delObjectAsync(stateId);
}
