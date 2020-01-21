import { padStart } from "alcalzone-shared/strings";

/** Returns the id of the device object for the given node id */
export function computeDeviceId(nodeId: number): string {
	return `Node_${padStart(nodeId.toString(), 3, "0")}`;
}

export function mapToRecord<TKey extends string | number | symbol, TValue>(
	map: ReadonlyMap<TKey, TValue>,
): Record<TKey, TValue> {
	const ret = {} as Record<TKey, TValue>;
	for (const [k, v] of map) {
		ret[k] = v;
	}
	return ret;
}

export interface NetworkHealPollResponse {
	type: "idle" | "done" | "progress";
	progress?: Record<number, boolean | undefined>;
}
