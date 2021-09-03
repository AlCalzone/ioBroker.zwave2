import { padStart } from "alcalzone-shared/strings";
import type {
	AssociationAddress,
	FirmwareUpdateStatus,
	InclusionGrant,
} from "zwave-js";

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

export function buffer2hex(buffer: Buffer): string {
	if (buffer.length === 0) return "";
	return `0x${buffer.toString("hex")}`;
}

/** Parses a buffer from a string has the form 0x[a-f0-9]+ */
export function bufferFromHex(hex: string): Buffer {
	return Buffer.from(hex.substr(2), "hex");
}

export function isBufferAsHex(str: string): boolean {
	return /^0x([a-fA-F0-9]{2})+$/.test(str);
}

export type PushMessage =
	| {
			type: "inclusion";
			status: InclusionStatus;
	  }
	| {
			type: "healing";
			status: NetworkHealStatus;
	  }
	| {
			type: "firmwareUpdate";
			progress: FirmwareUpdateProgress;
	  };

export interface NetworkHealStatus {
	type: "done" | "progress";
	progress?: Record<number, "pending" | "done" | "failed" | "skipped">;
}

export type InclusionStatus =
	| {
			type: "waitingForDevice";
	  }
	| {
			type: "validateDSK";
			dsk: string;
	  }
	| {
			type: "grantSecurityClasses";
			request: InclusionGrant;
	  }
	| {
			type: "busy";
	  }
	| {
			type: "done";
			nodeId: number;
			lowSecurity: boolean;
			securityClass?: string;
	  };

export interface FirmwareUpdateProgress {
	type: "done" | "progress";
	sentFragments?: number;
	totalFragments?: number;
	status?: FirmwareUpdateStatus;
	waitTime?: number;
}

export type AssociationDefinition = AssociationAddress & {
	sourceEndpoint?: number;
	group: number;
};

export function getErrorMessage(e: unknown, includeStack?: boolean): string {
	if (e instanceof Error)
		return includeStack && e.stack ? e.stack : e.message;
	return String(e);
}
