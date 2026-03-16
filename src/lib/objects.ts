import {
	CommandClasses,
	Duration,
	enumValuesToMetadataStates,
	NODE_ID_BROADCAST,
	SecurityClass,
	ValueID,
	ValueMetadata,
} from "@zwave-js/core";
import { entries } from "alcalzone-shared/objects";
import { padStart } from "alcalzone-shared/strings";
import { isArray, isObject } from "alcalzone-shared/typeguards";
import { ControllerStatistics, RFRegion } from "zwave-js";
import {
	NodeStatistics,
	NodeStatus,
	VirtualNode,
	VirtualValueID,
	ZWaveNode,
	ZWaveNotificationCallbackArgs_NotificationCC,
} from "zwave-js/Node";
import type {
	TranslatedValueID,
	ValueMetadataNumeric,
	ValueType,
	ZWaveNodeMetadataUpdatedArgs,
	ZWaveNodeValueAddedArgs,
	ZWaveNodeValueNotificationArgs,
	ZWaveNodeValueRemovedArgs,
	ZWaveNodeValueUpdatedArgs,
} from "zwave-js/Values";
import { Global as _ } from "./global";
import { buffer2hex, computeDeviceId, getErrorMessage } from "./shared";

type ZWaveNodeArgs =
	| ZWaveNodeValueAddedArgs
	| ZWaveNodeValueUpdatedArgs
	| ZWaveNodeValueRemovedArgs
	| ZWaveNodeValueNotificationArgs
	| ZWaveNodeMetadataUpdatedArgs;

export function nodeStatusToStatusState(status: NodeStatus): string {
	switch (status) {
		case NodeStatus.Awake:
			return "awake";
		case NodeStatus.Asleep:
			return "asleep";
		case NodeStatus.Alive:
			return "alive";
		case NodeStatus.Dead:
			return "dead";
		case NodeStatus.Unknown:
			return "unknown";
	}
}

function safeValue(value: unknown): ioBroker.StateValue {
	if (value == undefined) return null;
	if (Buffer.isBuffer(value)) {
		// We cannot store Buffers in ioBroker, encode them as HEX
		return buffer2hex(value);
	} else if (isArray(value) || isObject(value)) {
		// ioBroker requires all arrays and objects to be stringified
		return JSON.stringify(value);
	}
	return value as any;
}

const isCamelCasedSafeNameRegex = /^(?!.*[\-_]$)[a-z]([a-zA-Z0-9\-_]+)$/;

export const DEVICE_ID_BROADCAST = "Broadcast";

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

export function ccNameToChannelIdFragment(ccName: string): string {
	return ccName.replace(/[\s]+/g, "_");
}

function computeChannelIdInternal(prefix: string, ccName: string): string {
	return `${prefix}.${ccNameToChannelIdFragment(ccName)}`;
}

export function computeChannelId(nodeId: number, ccName: string): string {
	return computeChannelIdInternal(computeDeviceId(nodeId), ccName);
}

export function computeVirtualChannelId(
	prefix: string,
	ccName: string,
): string {
	return computeChannelIdInternal(prefix, ccName);
}

function computeStateIdInternal(
	prefix: string,
	args: TranslatedValueID,
): string {
	return [
		prefix,
		ccNameToChannelIdFragment(args.commandClassName),
		[
			args.propertyName?.trim() && nameToStateId(args.propertyName),
			args.endpoint && padStart(args.endpoint.toString(), 3, "0"),
			args.propertyKeyName?.trim() && nameToStateId(args.propertyKeyName),
		]
			.filter((s) => !!s)
			.join("_"),
	].join(".");
}

export function computeStateId(
	nodeId: number,
	args: TranslatedValueID,
): string {
	return computeStateIdInternal(computeDeviceId(nodeId), args);
}

export function computeVirtualStateId(
	prefix: string,
	args: TranslatedValueID,
): string {
	return computeStateIdInternal(prefix, args);
}

const secClassDefinitions = [
	[SecurityClass.S2_AccessControl, CommandClasses["Security 2"]],
	[SecurityClass.S2_Authenticated, CommandClasses["Security 2"]],
	[SecurityClass.S2_Unauthenticated, CommandClasses["Security 2"]],
	[SecurityClass.S0_Legacy, CommandClasses["Security"]],
] as const;

function securityClassesToRecord(node: ZWaveNode): Record<string, boolean> {
	const ret = {} as Record<string, boolean>;
	for (const [secClass, cc] of secClassDefinitions) {
		if (!node.supportsCC(cc)) continue;
		ret[SecurityClass[secClass]] = node.hasSecurityClass(secClass) === true;
	}
	return ret;
}

function nodeToNative(node: ZWaveNode): Record<string, any> {
	return {
		id: node.id,
		isControllerNode: node.isControllerNode,
		manufacturerId: node.manufacturerId,
		productType: node.productType,
		productId: node.productId,
		...(node.deviceClass && {
			type: {
				basic: node.deviceClass.basic.label,
				generic: node.deviceClass.generic.label,
				...(node.deviceClass.specific.key !== 0x00
					? // Only use the the specific device class if it is not "Unused"
					  { specific: node.deviceClass.specific.label }
					: {}),
			},
		}),
		// endpoints: node.getEndpointCount(),
		endpointIndizes: node.getEndpointIndizes(),
		securityClasses: securityClassesToRecord(node),
		secure: node.isSecure,
		canSleep: node.canSleep,
		supportsFirmwareUpdate: node.supportsCC(
			CommandClasses["Firmware Update Meta Data"],
		),
	};
}

function nodeToCommon(
	node: ZWaveNode,
): ioBroker.DeviceCommon & { name: string | undefined } {
	const deviceId = computeDeviceId(node.id);
	
	return {
		name: node.deviceConfig
			? `${node.deviceConfig.manufacturer} ${node.deviceConfig.label}`
			: `Node ${padStart(node.id.toString(), 3, "0")}`,
		statusStates: {
			onlineId: `${_.adapter.namespace}.${deviceId}.ready`,
			errorId: `${_.adapter.namespace}.${deviceId}.error`
		}
	};
}

const fallbackNodeNameRegex = /^Node \d+$/;

export async function extendNode(node: ZWaveNode): Promise<void> {
	const deviceId = computeDeviceId(node.id);
	const originalObject = _.adapter.oObjects[
		`${_.adapter.namespace}.${deviceId}`
	] as ioBroker.DeviceObject | undefined;

	// update the object while preserving the existing common properties
	const nodeCommon = nodeToCommon(node);
	// Overwrite empty names and placeholder/fallback names
	let newName = originalObject?.common.name as string | undefined;
	newName =
		newName && !fallbackNodeNameRegex.test(newName)
			? newName
			: nodeCommon.name;

	const desiredObject: ioBroker.SettableObject = {
		type: "device",
		common: {
			...nodeCommon,
			...originalObject?.common,
			name: newName,
		},
		native: nodeToNative(node),
	};

	await setOrExtendObject(deviceId, desiredObject, originalObject);
}

export async function ensureBroadcastNode(): Promise<void> {
	const deviceId = DEVICE_ID_BROADCAST;
	const originalObject = _.adapter.oObjects[
		`${_.adapter.namespace}.${deviceId}`
	] as ioBroker.DeviceObject | undefined;

	const desiredObject: ioBroker.SettableObject = {
		type: "device",
		common: {
			name: originalObject?.common.name || "Broadcast",
		},
		native: {
			broadcast: true,
		},
	};

	await setOrExtendObject(deviceId, desiredObject, originalObject);
}

/** Removed all objects that belong to a node */
export async function removeNode(nodeId: number): Promise<void> {
	const deviceId = `${_.adapter.namespace}.${computeDeviceId(nodeId)}`;
	try {
		await _.adapter.delForeignObjectAsync(deviceId);
	} catch (e) {
		/* ok */
	}

	// Find all channel and state objects so we can delete them
	const existingObjs = {
		...(await _.$$(`${deviceId}.*`, { type: "channel" })),
		...(await _.$$(`${deviceId}.*`, { type: "state" })),
	};

	for (const [id, obj] of entries(existingObjs)) {
		if (obj.type === "state") {
			try {
				await _.adapter.delForeignStateAsync(id);
			} catch (e) {
				/* ok */
			}
		}
		try {
			await _.adapter.delForeignObjectAsync(id);
		} catch (e) {
			/* ok */
		}
	}
}

async function extendCCInternal(
	node: ZWaveNode | VirtualNode,
	channelId: string,
	cc: CommandClasses,
	ccName: string,
): Promise<void> {
	const common = {
		name: ccName,
	};
	const native = {
		cc,
		version: node.getCCVersion(cc),
	};

	const originalObject =
		_.adapter.oObjects[`${_.adapter.namespace}.${channelId}`];
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

export async function extendCC(
	node: ZWaveNode,
	cc: CommandClasses,
	ccName: string,
): Promise<void> {
	await extendCCInternal(node, computeChannelId(node.id, ccName), cc, ccName);
}

export async function extendVirtualNodeCC(
	node: VirtualNode,
	deviceId: string,
	cc: CommandClasses,
	ccName: string,
): Promise<void> {
	await extendCCInternal(
		node,
		computeVirtualChannelId(deviceId, ccName),
		cc,
		ccName,
	);
}

export async function extendValue(
	node: ZWaveNode,
	args: ZWaveNodeValueAddedArgs | ZWaveNodeValueUpdatedArgs,
	fromCache: boolean = false,
): Promise<void> {
	const stateId = computeStateId(node.id, args);

	await extendMetadata(node, args);
	try {
		const state: ioBroker.SettableState = {
			val: safeValue(args.newValue),
			ack: true,
		};
		// TODO: remove this after JS-Controller 3.2 is stable
		if (fromCache) {
			// Set cached values with a lower quality (substitute value from device or instance), so scripts can ignore the update
			(state as any).q = 0x40;
		}
		if (fromCache) {
			// Avoid queueing too many events when reading from cache
			await _.adapter.setStateChangedAsync(stateId, state);
		} else {
			await _.adapter.setStateAsync(stateId, state);
		}
	} catch (e) {
		_.adapter.log.error(
			`Cannot set state "${stateId}" in ioBroker: ${getErrorMessage(e)}`,
		);
	}
}

export async function extendNotificationValue(
	node: ZWaveNode,
	args: ZWaveNodeValueNotificationArgs,
): Promise<void> {
	const stateId = computeStateId(node.id, args);

	await extendMetadata(node, args);
	try {
		const state: ioBroker.SettableState = {
			val: safeValue(args.value),
			ack: true,
			expire: 1,
		};
		await _.adapter.setStateAsync(stateId, state);
	} catch (e) {
		_.adapter.log.error(
			`Cannot set state "${stateId}" in ioBroker: ${getErrorMessage(e)}`,
		);
	}
}

export async function extendMetadata(
	node: ZWaveNode,
	args: ZWaveNodeArgs,
): Promise<void> {
	const stateId = computeStateId(node.id, args);
	const metadata =
		("metadata" in args && args.metadata) || node.getValueMetadata(args);

	await extendMetadataInternal(stateId, metadata, args, { nodeId: node.id });
}

export async function extendVirtualMetadata(
	node: VirtualNode,
	deviceId: string,
	{ metadata, ccVersion, ...valueId }: VirtualValueID,
): Promise<void> {
	const stateId = computeVirtualStateId(deviceId, valueId);
	await extendMetadataInternal(
		stateId,
		metadata,
		valueId,
		node.id === NODE_ID_BROADCAST
			? {
					broadcast: true,
			  }
			: {
					nodeIds: node.physicalNodes.map((n) => n.id),
			  },
	);
}

async function extendMetadataInternal(
	stateId: string,
	metadata: ValueMetadata,
	valueId: ValueID,
	nativePart: Record<string, any> = {},
) {
	const stateType = valueTypeToIOBrokerType(metadata.type);
	// TODO: Try to detect more specific roles depending on the CC type

	const originalObject =
		_.adapter.oObjects[`${_.adapter.namespace}.${stateId}`];

	const newStateName =
		_.adapter.config.preserveStateNames && originalObject?.common.name
			? // Keep the original name if one exists and it should be preserved
			  originalObject.common.name
			: // Otherwise try to construct a new name from the metadata
			metadata.label
			? `${metadata.label}${
					valueId.endpoint ? ` (Endpoint ${valueId.endpoint})` : ""
			  }`
			: // and fall back to the state ID if that is missing
			  stateId;

	// Keep the defined role if the object already exists. Our roles are not good enough for visualizations yet
	const stateRole =
		originalObject?.common.role || metadataToStateRole(stateType, metadata);

	const objectDefinition: ioBroker.SettableObjectWorker<ioBroker.StateObject> =
		{
			type: "state",
			common: {
				role: stateRole,
				read: metadata.readable,
				write: metadata.writeable,
				name: newStateName,
				desc: metadata.description,
				type: stateType,
				min: (metadata as ValueMetadataNumeric).min,
				max: (metadata as ValueMetadataNumeric).max,
				def: (metadata as ValueMetadataNumeric).default,
				unit: (metadata as ValueMetadataNumeric).unit,
				states: (metadata as any).states,
			},
			native: {
				...nativePart,
				valueId: {
					commandClass: valueId.commandClass,
					endpoint: valueId.endpoint,
					property: valueId.property,
					propertyKey: valueId.propertyKey,
				},
				steps: (metadata as ValueMetadataNumeric).steps,
			} as any,
		};

	await setOrExtendObject(stateId, objectDefinition, originalObject);
}

export async function removeValue(
	nodeId: number,
	args: ZWaveNodeValueRemovedArgs,
): Promise<void> {
	const stateId = computeStateId(nodeId, args);
	try {
		await _.adapter.delObjectAsync(stateId);
	} catch {
		// ignore, the object does not exist
	}
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
			if (valueType?.endsWith("[]")) return "array";
	}
	return "mixed";
}

function metadataToStateRole(
	stateType: ioBroker.StateCommon["type"],
	meta: ValueMetadata,
): ioBroker.StateCommon["role"] {
	if (stateType === "number") {
		return meta.writeable ? "level" : "value";
	} else if (stateType === "boolean") {
		return meta.readable && !meta.writeable ? "indicator" : "switch";
	}
	return "state";
}

export async function setNodeStatus(
	nodeId: number,
	status: string,
): Promise<void> {
	const stateId = `${computeDeviceId(nodeId)}.status`;
	await _.adapter.setObjectNotExistsAsync(stateId, {
		type: "state",
		common: {
			name: "Node status",
			role: "indicator",
			type: "string",
			read: true,
			write: false,
		},
		native: {},
	});
	await _.adapter.setStateAsync(stateId, status, true);
	
	const errorId = `${computeDeviceId(nodeId)}.error`;
	await _.adapter.setObjectNotExistsAsync(errorId, {
		type: "state",
		common: {
			name: "Node error",
			role: "indicator",
			type: "boolean",
			read: true,
			write: false,
			def: false
		},
		native: {},
	});
	await _.adapter.setStateAsync(errorId, status === 'dead', true);
}

/** Updates the ready state for the given node */
export async function setNodeReady(
	nodeId: number,
	ready: boolean,
): Promise<void> {
	const stateId = `${computeDeviceId(nodeId)}.ready`;
	await _.adapter.setObjectNotExistsAsync(stateId, {
		type: "state",
		common: {
			name: "Ready to use",
			role: "indicator",
			type: "boolean",
			read: true,
			write: false,
			def: false
		},
		native: {},
	});
	await _.adapter.setStateAsync(stateId, ready, true);
}

export async function setControllerStatistics(
	statistics: ControllerStatistics | null,
): Promise<void> {
	const stateId = `info.statistics`;
	await _.adapter.setObjectNotExistsAsync(stateId, {
		type: "state",
		common: {
			name: "Communication statistics",
			role: "indicator",
			type: "object",
			read: true,
			write: false,
		},
		native: {},
	});
	await _.adapter.setStateAsync(
		stateId,
		statistics ? JSON.stringify(statistics) : null,
		true,
	);
}

export async function setNodeStatistics(
	nodeId: number,
	statistics: NodeStatistics | null,
): Promise<void> {
	const channelId = `${computeDeviceId(nodeId)}.info`;
	const stateId = `${channelId}.statistics`;
	await _.adapter.setObjectNotExistsAsync(channelId, {
		type: "channel",
		common: {
			name: "Information",
		},
		native: {},
	});
	await _.adapter.setObjectNotExistsAsync(stateId, {
		type: "state",
		common: {
			name: "Transmission statistics",
			role: "indicator",
			type: "object",
			read: true,
			write: false,
		},
		native: {},
	});
	await _.adapter.setStateAsync(
		stateId,
		statistics ? JSON.stringify(statistics) : null,
		true,
	);
}

export function computeNotificationId(
	nodeId: number,
	notificationLabel: string,
	eventLabel: string,
	property?: string,
): string {
	return [
		computeDeviceId(nodeId),
		ccNameToChannelIdFragment("Notification"),
		[
			nameToStateId(notificationLabel),
			nameToStateId(eventLabel),
			property && nameToStateId(property),
		]
			.filter((s) => !!s)
			.join("_"),
	].join(".");
}

async function setOrExtendObject(
	id: string,
	definition: ioBroker.SettableObject,
	original: ioBroker.Object | undefined,
) {
	if (original == undefined) {
		await _.adapter.setObjectAsync(id, definition);
	} else if (
		JSON.stringify(definition.common) !== JSON.stringify(original.common) ||
		JSON.stringify(definition.native) !== JSON.stringify(original.native)
	) {
		await _.adapter.extendObjectAsync(id, definition);
	}
}

async function setNotificationValue(
	nodeId: number,
	notificationLabel: string,
	eventLabel: string,
	property: string | undefined,
	value: boolean | number | string | Duration = true,
): Promise<void> {
	const stateId = computeNotificationId(
		nodeId,
		notificationLabel,
		eventLabel,
		property,
	);
	const originalObject =
		_.adapter.oObjects[`${_.adapter.namespace}.${stateId}`];

	const newStateName =
		_.adapter.config.preserveStateNames && originalObject?.common.name
			? // Keep the original name if one exists and it should be preserved
			  originalObject.common.name
			: // Otherwise use the given label (and property name)
			  `${notificationLabel}: ${eventLabel}${
					!!property ? ` (${property})` : ""
			  }`;

	const objectDefinition: ioBroker.SettableObjectWorker<ioBroker.StateObject> =
		{
			type: "state",
			common:
				typeof value === "boolean"
					? {
							role: "indicator",
							read: true,
							write: false,
							name: newStateName,
							type: "boolean",
					  }
					: typeof value === "number"
					? {
							role: "value",
							read: true,
							write: false,
							name: newStateName,
							type: "number",
					  }
					: value instanceof Duration
					? {
							role: "value.interval",
							read: true,
							write: false,
							name: newStateName,
							type: "number",
							unit: "seconds",
					  }
					: {
							role: "text",
							read: true,
							write: false,
							name: newStateName,
							type: "string",
					  },
			native: {
				nodeId: nodeId,
				notificationEvent: true,
			},
		};

	// Translate the value into something useful
	let val;
	if (value instanceof Duration) {
		val = value.toMilliseconds();
		if (val == undefined) val = "unknown";
		else val /= 1000;
	} else {
		val = value;
	}

	await setOrExtendObject(stateId, objectDefinition, originalObject);
	await _.adapter.setStateAsync(
		stateId,
		{
			val,
			expire: _.adapter.config.notificationEventValidity ?? 1000,
		},
		true,
	);
}

/** Translates a notification for the Notification CC into states */
export async function extendNotification_NotificationCC(
	node: ZWaveNode,
	args: ZWaveNotificationCallbackArgs_NotificationCC,
): Promise<void> {
	const { label, eventLabel, parameters } = args;
	if (parameters == undefined) {
		await setNotificationValue(node.id, label, eventLabel, undefined, true);
	} else if (Buffer.isBuffer(parameters)) {
		await setNotificationValue(
			node.id,
			label,
			eventLabel,
			undefined,
			parameters.toString("hex"),
		);
	} else if (parameters instanceof Duration) {
		await setNotificationValue(
			node.id,
			label,
			eventLabel,
			undefined,
			parameters,
		);
	} else {
		for (const [key, value] of Object.entries(parameters)) {
			await setNotificationValue(node.id, label, eventLabel, key, value);
		}
	}
}

export async function setRFRegionState(
	rfRegion: RFRegion | undefined,
): Promise<void> {
	const stateId = `info.rfRegion`;
	await _.adapter.setObjectNotExistsAsync(stateId, {
		type: "state",
		common: {
			name: "RF Region",
			role: "info.region",
			type: "number",
			read: true,
			write: false,
			states: enumValuesToMetadataStates(RFRegion),
		},
		native: {},
	});
	await _.adapter.setStateAsync(stateId, rfRegion ?? null, true);
}
