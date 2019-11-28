"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strings_1 = require("alcalzone-shared/strings");
const global_1 = require("./global");
/** Converts a device label to a valid filename */
function nameToStateId(label) {
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
        // Remove trailing and leading underscores
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
/** Returns the id of the device object for the given node id */
function computeDeviceId(nodeId) {
    return `Node_${strings_1.padStart(nodeId.toString(), 3, "0")}`;
}
exports.computeDeviceId = computeDeviceId;
function computeId(nodeId, args) {
    var _a, _b;
    return [
        computeDeviceId(nodeId),
        args.commandClassName.replace(/[\s]+/g, "_"),
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
//# sourceMappingURL=objects.js.map