import { padStart } from "alcalzone-shared/strings";
import { NodeStatus } from "zwave-js";

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
	progress?: Record<number, "pending" | "done" | "failed" | "skipped">;
}

export interface AssociationDefinition {
	groupId: number;
	targetNodeId: number;
	endpoint?: number;
}

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
