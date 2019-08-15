"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strings_1 = require("alcalzone-shared/strings");
const global_1 = require("./global");
const tools_1 = require("./tools");
function computeId(nodeId, args) {
    return [
        `Node_${strings_1.padStart(nodeId.toString(), 3, "0")}`,
        args.commandClassName.replace(/[\s]+/g, "_"),
        [
            args.endpoint &&
                `Endpoint_${strings_1.padStart(args.endpoint.toString(), 2, "0")}`,
            args.propertyName,
            args.propertyKey,
        ]
            .filter(s => !!s)
            .join("_"),
    ].join(".");
}
exports.computeId = computeId;
async function extendValue(node, args) {
    const stateId = computeId(node.id, args);
    const metadata = node.getValueMetadata(args.commandClass, args.endpoint || 0, args.propertyName, args.propertyKey);
    // Create object if it doesn't exist
    const objectDefinition = {
        type: "state",
        common: {
            role: "value",
            read: metadata.readable,
            write: metadata.writeable,
            name: metadata.label || stateId,
            desc: metadata.description,
            type: getCommonType(args.newValue),
        },
        native: {},
    };
    if ("min" in metadata)
        objectDefinition.common.min = metadata.min;
    if ("max" in metadata)
        objectDefinition.common.max = metadata.max;
    await global_1.Global.adapter.setObjectNotExistsAsync(stateId, objectDefinition);
    await global_1.Global.adapter.setStateAsync(stateId, args.newValue, true);
}
exports.extendValue = extendValue;
async function removeValue(nodeId, args) {
    const stateId = computeId(nodeId, args);
    await global_1.Global.adapter.delObjectAsync(stateId);
}
exports.removeValue = removeValue;
function getCommonType(value) {
    if (typeof value === "number")
        return "number";
    if (typeof value === "boolean")
        return "boolean";
    if (typeof value === "string")
        return "string";
    if (tools_1.isArray(value))
        return "array";
    if (tools_1.isObject(value))
        return "object";
    return "mixed";
}
//# sourceMappingURL=objects.js.map