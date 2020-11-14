import { CommandClasses, Duration, ValueMetadata } from "@zwave-js/core";
import { entries } from "alcalzone-shared/objects";
import { padStart } from "alcalzone-shared/strings";
import type { CommandClass } from "zwave-js/CommandClass";
import { NodeStatus, ZWaveNode } from "zwave-js/Node";
import type {
	TranslatedValueID,
	ValueMetadataNumeric,
	ValueType,
	ZWaveNodeMetadataUpdatedArgs,
	ZWaveNodeValueAddedArgs,
	ZWaveNodeValueRemovedArgs,
	ZWaveNodeValueUpdatedArgs,
} from "zwave-js/Values";
import { Global as _ } from "./global";
import { buffer2hex, computeDeviceId } from "./shared";

type ZWaveNodeArgs =
	| ZWaveNodeValueAddedArgs
	| ZWaveNodeValueUpdatedArgs
	| ZWaveNodeValueRemovedArgs
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

const isCamelCasedSafeNameRegex = /^(?!.*[\-_]$)[a-z]([a-zA-Z0-9\-_]+)$/;

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

export function computeChannelId(nodeId: number, ccName: string): string {
	return `${computeDeviceId(nodeId)}.${ccNameToChannelIdFragment(ccName)}`;
}

export function computeId(nodeId: number, args: TranslatedValueID): string {
	return [
		computeDeviceId(nodeId),
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

function nodeToNative(node: ZWaveNode): Record<string, any> {
	return {
		id: node.id,
		manufacturerId: node.manufacturerId,
		productType: node.productType,
		productId: node.productId,
		...(node.deviceClass && {
			type: {
				basic: node.deviceClass.basic.label,
				generic: node.deviceClass.generic.label,
				specific: node.deviceClass.specific.label,
			},
		}),
		endpoints: node.getEndpointCount(),
		secure: node.isSecure,
		supportsFirmwareUpdate: node.supportsCC(
			CommandClasses["Firmware Update Meta Data"],
		),
	};
}

function nodeToCommon(node: ZWaveNode): ioBroker.DeviceCommon {
	return {
		name: node.deviceConfig
			? `${node.deviceConfig.manufacturer} ${node.deviceConfig.label}`
			: `Node ${padStart(node.id.toString(), 3, "0")}`,
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
	let newName = originalObject?.common.name;
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

export async function extendCC(
	node: ZWaveNode,
	cc: CommandClasses,
	ccName: string,
): Promise<void> {
	const channelId = computeChannelId(node.id, ccName);
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

export async function extendValue(
	node: ZWaveNode,
	args: ZWaveNodeValueAddedArgs | ZWaveNodeValueUpdatedArgs,
	fromCache: boolean = false,
): Promise<void> {
	const stateId = computeId(node.id, args);

	await extendMetadata(node, args);
	try {
		let newValue = args.newValue ?? null;
		if (Buffer.isBuffer(newValue)) {
			// We cannot store Buffers in ioBroker, encode them as HEX
			newValue = buffer2hex(newValue);
		}
		const state: ioBroker.SettableState = {
			val: newValue as any,
			ack: true,
		};
		// TODO: remove this after JS-Controller 3.2 is stable
		if (fromCache) {
			// Set cached values with a lower quality (substitute value from device or instance), so scripts can ignore the update
			state.q = 0x40;
		}
		if (fromCache) {
			// Avoid queueing too many events when reading from cache
			await _.adapter.setStateChangedAsync(stateId, state);
		} else {
			await _.adapter.setStateAsync(stateId, state);
		}
	} catch (e) {
		_.adapter.log.error(`Cannot set state "${stateId}" in ioBroker: ${e}`);
	}
}

export async function extendMetadata(
	node: ZWaveNode,
	args: ZWaveNodeArgs,
): Promise<void> {
	const stateId = computeId(node.id, args);
	const metadata =
		("metadata" in args && args.metadata) || node.getValueMetadata(args);

	const stateType = valueTypeToIOBrokerType(metadata.type);
	// TODO: Try to detect more specific roles depending on the CC type
	const stateRole = metadataToStateRole(stateType, metadata);

	const originalObject =
		_.adapter.oObjects[`${_.adapter.namespace}.${stateId}`];

	const newStateName =
		_.adapter.config.preserveStateNames && originalObject?.common.name
			? // Keep the original name if one exists and it should be preserved
			  originalObject.common.name
			: // Otherwise try to construct a new name from the metadata
			metadata.label
			? `${metadata.label}${
					args.endpoint ? ` (Endpoint ${args.endpoint})` : ""
			  }`
			: // and fall back to the state ID if that is missing
			  stateId;

	const objectDefinition: ioBroker.SettableObjectWorker<ioBroker.StateObject> = {
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
			nodeId: node.id,
			valueId: {
				commandClass: args.commandClass,
				endpoint: args.endpoint,
				property: args.property,
				propertyKey: args.propertyKey,
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

function metadataToStateRole(
	stateType: ioBroker.StateCommon["type"],
	meta: ValueMetadata,
): ioBroker.StateCommon["role"] {
	if (stateType === "number") {
		return meta.writeable ? "level" : "value";
	} else if (stateType === "boolean") {
		return meta.readable && meta.writeable
			? "switch"
			: meta.readable
			? "indicator"
			: "button";
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
			def: false,
		},
		native: {},
	});
	await _.adapter.setStateAsync(stateId, ready, true);
}

export function computeNotificationId(
	nodeId: number,
	label: string,
	property?: string,
): string {
	return [
		computeDeviceId(nodeId),
		ccNameToChannelIdFragment("Notification"),
		[nameToStateId(label), property && nameToStateId(property)]
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
	label: string,
	property: string | undefined,
	value: boolean | number | string | Duration = true,
): Promise<void> {
	const stateId = computeNotificationId(nodeId, label, property);
	const originalObject =
		_.adapter.oObjects[`${_.adapter.namespace}.${stateId}`];

	const newStateName =
		_.adapter.config.preserveStateNames && originalObject?.common.name
			? // Keep the original name if one exists and it should be preserved
			  originalObject.common.name
			: // Otherwise use the given label (and property name)
			  `${label}${!!property ? ` (${property})` : ""}`;

	const objectDefinition: ioBroker.SettableObjectWorker<ioBroker.StateObject> = {
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

export async function extendNotification(
	node: ZWaveNode,
	label: string,
	parameters?:
		| Buffer
		| Duration
		| CommandClass
		| Record<string, number>
		| undefined,
): Promise<void> {
	if (parameters == undefined) {
		await setNotificationValue(node.id, label, undefined, true);
	} else if (Buffer.isBuffer(parameters)) {
		await setNotificationValue(
			node.id,
			label,
			undefined,
			parameters.toString("hex"),
		);
	} else if (parameters instanceof Duration) {
		await setNotificationValue(node.id, label, undefined, parameters);
	} else {
		for (const [key, value] of Object.entries(parameters)) {
			await setNotificationValue(node.id, label, key, value);
		}
	}
}
