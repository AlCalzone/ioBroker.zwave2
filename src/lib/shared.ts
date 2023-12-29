import type {
	AssociationAddress,
	FirmwareUpdateStatus,
} from "@zwave-js/cc/safe";
import { padStart } from "alcalzone-shared/strings";
import type React from "react";
import type {
	ControllerStatistics,
	InclusionGrant,
	NodeStatistics,
	SmartStartProvisioningEntry,
} from "zwave-js/safe";

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
			status: InclusionExclusionStatus;
	  }
	| {
			type: "rebuildRoutes";
			status: RebuildRoutesStatus;
	  }
	| {
			type: "firmwareUpdate";
			progress: FirmwareUpdateProgress;
	  }
	| {
			type: "log";
			info: ZWaveLogInfo;
	  };

export interface RebuildRoutesStatus {
	type: "done" | "progress";
	progress?: Record<number, "pending" | "done" | "failed" | "skipped">;
}

export type InclusionExclusionStatus =
	| {
			type: "waitingForDevice";
	  }
	| {
			type: "chooseReplacementStrategy";
			nodeId: number;
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
			type: "scanQRCode";
	  }
	| {
			type: "busy";
	  }
	| {
			type: "done";
			nodeId: number;
			lowSecurity: boolean;
			securityClass?: string;
	  }
	| {
			type: "exclusionDone";
			nodeId: number;
	  }
	| {
			type: "resultMessage";
			success: boolean;
			title: string;
			message: React.ReactNode;
	  };

export type ScanQRCodeResult =
	| {
			type: "none" | "S2";
	  }
	| ({
			type: "SmartStart" | "provisioned";
	  } & SmartStartProvisioningEntry)
	| {
			type: "included";
			nodeId: number;
	  };
export interface FirmwareUpdateProgress {
	type: "done" | "progress";
	currentFile?: number;
	totalFiles?: number;
	sentFragments?: number;
	totalFragments?: number;
	status?: FirmwareUpdateStatus;
	waitTime?: number;
}

export type AssociationDefinition = AssociationAddress & {
	sourceEndpoint?: number;
	group: number;
};

export interface ZWaveLogInfo {
	direction: string;
	primaryTags?: string;
	secondaryTags?: string;
	timestamp?: string;
	label?: string;
	message: string;
}

export function getErrorMessage(e: unknown, includeStack?: boolean): string {
	if (e instanceof Error)
		return includeStack && e.stack ? e.stack : e.message;
	return String(e);
}

export function getDefaultControllerStatistics(): ControllerStatistics {
	return {
		CAN: 0,
		NAK: 0,
		messagesDroppedRX: 0,
		messagesDroppedTX: 0,
		messagesRX: 0,
		messagesTX: 0,
		timeoutACK: 0,
		timeoutCallback: 0,
		timeoutResponse: 0,
	};
}

export function getDefaultNodeStatistics(): NodeStatistics {
	return {
		commandsRX: 0,
		commandsTX: 0,
		commandsDroppedRX: 0,
		commandsDroppedTX: 0,
		timeoutResponse: 0,
	};
}
