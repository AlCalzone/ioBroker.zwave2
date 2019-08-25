"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strings_1 = require("alcalzone-shared/strings");
const global_1 = require("./global");
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
            name: metadata.label || stateId,
            desc: metadata.description,
            type: valueTypeToIOBrokerType(metadata.type),
            min: metadata.min,
            max: metadata.max,
            def: metadata.default,
            states: metadata.states,
        },
        native: {
            nodeId: node.id,
            valueId: {
                commandClass: args.commandClass,
                endpoint: args.endpoint,
                propertyName: args.propertyName,
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