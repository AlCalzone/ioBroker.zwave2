import { padStart } from "alcalzone-shared/strings";
import type { FirmwareUpdateStatus } from "zwave-js";

// WARNING: DO NOT IMPORT values FROM "zwave-js" HERE
// That will break the frontend

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

export interface FirmwareUpdatePollResponse {
	type: "done" | "progress";
	sentFragments?: number;
	totalFragments?: number;
	status?: FirmwareUpdateStatus;
	waitTime?: number;
}

export interface AssociationDefinition {
	groupId: number;
	targetNodeId: number;
	endpoint?: number;
}

export enum InclusionMode {
	Idle = 0,
	NonSecure = 1,
	Secure = 2,
}
