"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strings_1 = require("alcalzone-shared/strings");
const DeviceClass_1 = require("zwave-js/build/lib/node/DeviceClass");
const global_1 = require("./global");
const shared_1 = require("./shared");
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
            .filter(s => !!s)
            .join("_"),
    ].join(".");
}
exports.computeId = computeId;
function nodeToNative(node) {
    return Object.assign({ id: node.id, manufacturerId: node.manufacturerId, productType: node.productType, productId: node.productId }, (node.deviceClass && {
        type: {
            basic: DeviceClass_1.BasicDeviceClasses[node.deviceClass.basic],
            generic: node.deviceClass.generic.name,
            specific: node.deviceClass.specific.name,
        },
    }));
}
function nodeToCommon(node) {
    return {
        name: node.deviceConfig
            ? `${node.deviceConfig.manufacturer} ${node.deviceConfig.label}`
            : `Node ${strings_1.padStart(node.id.toString(), 3, "0")}`,
    };
}
async function extendNode(node) {
    const deviceId = shared_1.computeDeviceId(node.id);
    const common = nodeToCommon(node);
    const native = nodeToNative(node);
    const originalObject = await global_1.Global.adapter.getObjectAsync(deviceId);
    if (originalObject == undefined) {
        await global_1.Global.adapter.setObjectAsync(deviceId, {
            type: "device",
            common,
            native,
        });
    }
    else if (JSON.stringify(common) !== JSON.stringify(originalObject.common) ||
        JSON.stringify(native) !== JSON.stringify(originalObject.native)) {
        await global_1.Global.adapter.extendObjectAsync(deviceId, {
            common,
            native,
        });
    }
}
exports.extendNode = extendNode;
async function extendCC(node, cc, ccName) {
    const channelId = computeChannelId(node.id, ccName);
    const common = {
        name: ccName,
    };
    const native = {
        cc,
        version: node.getCCVersion(cc),
    };
    const originalObject = await global_1.Global.adapter.getObjectAsync(channelId);
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
async function extendValue(node, args) {
    const stateId = computeId(node.id, args);
    await extendMetadata(node, args);
    await global_1.Global.adapter.setStateAsync(stateId, args.newValue, true);
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
    // FIXME: Only set the object when it changed
    await global_1.Global.adapter.setObjectAsync(stateId, objectDefinition);
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
//# sourceMappingURL=objects.js.map