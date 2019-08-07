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
async function extendValue(nodeId, args) {
    const stateId = computeId(nodeId, args);
    // Create object if it doesn't exist
    await global_1.Global.adapter.setObjectNotExistsAsync(stateId, {
        type: "state",
        common: {
            role: "value",
            read: true,
            write: true,
            name: stateId,
        },
        native: {},
    });
    // Update value
    await global_1.Global.adapter.setStateAsync(stateId, args.newValue, true);
}
exports.extendValue = extendValue;
async function removeValue(nodeId, args) {
    const stateId = computeId(nodeId, args);
    await global_1.Global.adapter.delObjectAsync(stateId);
}
exports.removeValue = removeValue;
//# sourceMappingURL=objects.js.map