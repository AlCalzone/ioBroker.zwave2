"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNodeReady = exports.setNodeStatus = exports.removeValue = exports.extendMetadata = exports.extendValue = exports.extendCC = exports.removeNode = exports.extendNode = exports.computeId = exports.computeChannelId = exports.ccNameToChannelIdFragment = exports.nameToStateId = exports.nodeStatusToStatusState = void 0;
const core_1 = require("@zwave-js/core");
const objects_1 = require("alcalzone-shared/objects");
const strings_1 = require("alcalzone-shared/strings");
const Node_1 = require("zwave-js/Node");
const global_1 = require("./global");
const shared_1 = require("./shared");
function nodeStatusToStatusState(status) {
    switch (status) {
        case Node_1.NodeStatus.Awake:
            return "awake";
        case Node_1.NodeStatus.Asleep:
            return "asleep";
        case Node_1.NodeStatus.Alive:
            return "alive";
        case Node_1.NodeStatus.Dead:
            return "dead";
        case Node_1.NodeStatus.Unknown:
            return "unknown";
    }
}
exports.nodeStatusToStatusState = nodeStatusToStatusState;
const isCamelCasedSafeNameRegex = /^(?!.*[\-_]$)[a-z]([a-zA-Z0-9\-_]+)$/;
/** Converts a device label to a valid filename */
function nameToStateId(label) {
    if (isCamelCasedSafeNameRegex.test(label))
        return label;
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
        if (safeName === replaced)
            break;
        // Otherwise remember the intermediate result for the next pass
        safeName = replaced;
    }
    return camelCase(safeName);
}
exports.nameToStateId = nameToStateId;
function camelCase(str) {
    return str
        .split(" ")
        .map((substr, i) => i === 0
        ? substr.toLowerCase()
        : substr[0].toUpperCase() + substr.slice(1).toLowerCase())
        .join("");
}
function ccNameToChannelIdFragment(ccName) {
    return ccName.replace(/[\s]+/g, "_");
}
exports.ccNameToChannelIdFragment = ccNameToChannelIdFragment;
function computeChannelId(nodeId, ccName) {
    return `${shared_1.computeDeviceId(nodeId)}.${ccNameToChannelIdFragment(ccName)}`;
}
exports.computeChannelId = computeChannelId;
function computeId(nodeId, args) {
    var _a, _b;
    return [
        shared_1.computeDeviceId(nodeId),
        ccNameToChannelIdFragment(args.commandClassName),
        [
            ((_a = args.propertyName) === null || _a === void 0 ? void 0 : _a.trim()) && nameToStateId(args.propertyName),
            args.endpoint && strings_1.padStart(args.endpoint.toString(), 3, "0"),
            ((_b = args.propertyKeyName) === null || _b === void 0 ? void 0 : _b.trim()) && nameToStateId(args.propertyKeyName),
        ]
            .filter((s) => !!s)
            .join("_"),
    ].join(".");
}
exports.computeId = computeId;
function nodeToNative(node) {
    return Object.assign(Object.assign({ id: node.id, manufacturerId: node.manufacturerId, productType: node.productType, productId: node.productId }, (node.deviceClass && {
        type: {
            basic: node.deviceClass.basic.label,
            generic: node.deviceClass.generic.label,
            specific: node.deviceClass.specific.label,
        },
    })), { endpoints: node.getEndpointCount(), secure: node.isSecure, supportsFirmwareUpdate: node.supportsCC(core_1.CommandClasses["Firmware Update Meta Data"]) });
}
function nodeToCommon(node) {
    return {
        name: node.deviceConfig
            ? `${node.deviceConfig.manufacturer} ${node.deviceConfig.label}`
            : `Node ${strings_1.padStart(node.id.toString(), 3, "0")}`,
    };
}
const fallbackNodeNameRegex = /^Node \d+$/;
async function extendNode(node) {
    const deviceId = shared_1.computeDeviceId(node.id);
    const originalObject = global_1.Global.adapter.oObjects[`${global_1.Global.adapter.namespace}.${deviceId}`];
    // update the object while preserving the existing common properties
    const nodeCommon = nodeToCommon(node);
    // Overwrite empty names and placeholder/fallback names
    let newName = originalObject === null || originalObject === void 0 ? void 0 : originalObject.common.name;
    newName =
        newName && !fallbackNodeNameRegex.test(newName)
            ? newName
            : nodeCommon.name;
    const desiredObject = {
        type: "device",
        common: Object.assign(Object.assign(Object.assign({}, nodeCommon), originalObject === null || originalObject === void 0 ? void 0 : originalObject.common), { name: newName }),
        native: nodeToNative(node),
    };
    // check if we have to update anything
    if (originalObject == undefined ||
        JSON.stringify(originalObject.common) !==
            JSON.stringify(desiredObject.common) ||
        JSON.stringify(originalObject.native) !==
            JSON.stringify(desiredObject.native)) {
        await global_1.Global.adapter.setObjectAsync(deviceId, desiredObject);
    }
}
exports.extendNode = extendNode;
/** Removed all objects that belong to a node */
async function removeNode(nodeId) {
    const deviceId = `${global_1.Global.adapter.namespace}.${shared_1.computeDeviceId(nodeId)}`;
    try {
        await global_1.Global.adapter.delForeignObjectAsync(deviceId);
    }
    catch (e) {
        /* ok */
    }
    // Find all channel and state objects so we can delete them
    const existingObjs = Object.assign(Object.assign({}, (await global_1.Global.$$(`${deviceId}.*`, { type: "channel" }))), (await global_1.Global.$$(`${deviceId}.*`, { type: "state" })));
    for (const [id, obj] of objects_1.entries(existingObjs)) {
        if (obj.type === "state") {
            try {
                await global_1.Global.adapter.delForeignStateAsync(id);
            }
            catch (e) {
                /* ok */
            }
        }
        try {
            await global_1.Global.adapter.delForeignObjectAsync(id);
        }
        catch (e) {
            /* ok */
        }
    }
}
exports.removeNode = removeNode;
async function extendCC(node, cc, ccName) {
    const channelId = computeChannelId(node.id, ccName);
    const common = {
        name: ccName,
    };
    const native = {
        cc,
        version: node.getCCVersion(cc),
    };
    const originalObject = global_1.Global.adapter.oObjects[`${global_1.Global.adapter.namespace}.${channelId}`];
    if (originalObject == undefined) {
        await global_1.Global.adapter.setObjectAsync(channelId, {
            type: "channel",
            common,
            native,
        });
    }
    else if (JSON.stringify(common) !== JSON.stringify(originalObject.common) ||
        JSON.stringify(native) !== JSON.stringify(originalObject.native)) {
        await global_1.Global.adapter.extendObjectAsync(channelId, {
            common,
            native,
        });
    }
}
exports.extendCC = extendCC;
async function extendValue(node, args, fromCache = false) {
    var _a;
    const stateId = computeId(node.id, args);
    await extendMetadata(node, args);
    try {
        await global_1.Global.adapter.setStateAsync(stateId, {
            val: ((_a = args.newValue) !== null && _a !== void 0 ? _a : null),
            ack: true,
            // Set cached values with a lower quality (substitute value from device or instance), so scripts can ignore the update
            q: fromCache ? 0x40 : undefined,
        });
    }
    catch (e) {
        global_1.Global.adapter.log.error(`Cannot set state "${stateId}" in ioBroker: ${e}`);
    }
}
exports.extendValue = extendValue;
async function extendMetadata(node, args) {
    const stateId = computeId(node.id, args);
    const metadata = ("metadata" in args && args.metadata) || node.getValueMetadata(args);
    const objectDefinition = {
        type: "state",
        common: {
            role: "value",
            read: metadata.readable,
            write: metadata.writeable,
            name: metadata.label
                ? `${metadata.label}${args.endpoint ? ` (Endpoint ${args.endpoint})` : ""}`
                : stateId,
            desc: metadata.description,
            type: valueTypeToIOBrokerType(metadata.type),
            min: metadata.min,
            max: metadata.max,
            def: metadata.default,
            unit: metadata.unit,
            states: metadata.states,
        },
        native: {
            nodeId: node.id,
            valueId: {
                commandClass: args.commandClass,
                endpoint: args.endpoint,
                property: args.property,
                propertyKey: args.propertyKey,
            },
            steps: metadata.steps,
        },
    };
    const originalObject = global_1.Global.adapter.oObjects[`${global_1.Global.adapter.namespace}.${stateId}`];
    if (originalObject == undefined) {
        await global_1.Global.adapter.setObjectAsync(stateId, objectDefinition);
    }
    else if (JSON.stringify(objectDefinition.common) !==
        JSON.stringify(originalObject.common) ||
        JSON.stringify(objectDefinition.native) !==
            JSON.stringify(originalObject.native)) {
        await global_1.Global.adapter.extendObjectAsync(stateId, objectDefinition);
    }
}
exports.extendMetadata = extendMetadata;
async function removeValue(nodeId, args) {
    const stateId = computeId(nodeId, args);
    await global_1.Global.adapter.delObjectAsync(stateId);
}
exports.removeValue = removeValue;
function valueTypeToIOBrokerType(valueType) {
    switch (valueType) {
        case "number":
        case "boolean":
        case "string":
            return valueType;
        case "any":
            return "mixed";
        default:
            if (valueType.endsWith("[]"))
                return "array";
    }
    return "mixed";
}
async function setNodeStatus(nodeId, status) {
    const stateId = `${shared_1.computeDeviceId(nodeId)}.status`;
    await global_1.Global.adapter.setObjectNotExistsAsync(stateId, {
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
    await global_1.Global.adapter.setStateAsync(stateId, status, true);
}
exports.setNodeStatus = setNodeStatus;
/** Updates the ready state for the given node */
async function setNodeReady(nodeId, ready) {
    const stateId = `${shared_1.computeDeviceId(nodeId)}.ready`;
    await global_1.Global.adapter.setObjectNotExistsAsync(stateId, {
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
    await global_1.Global.adapter.setStateAsync(stateId, ready, true);
}
exports.setNodeReady = setNodeReady;
//# sourceMappingURL=objects.js.map