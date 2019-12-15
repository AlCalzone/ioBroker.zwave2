"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strings_1 = require("alcalzone-shared/strings");
/** Returns the id of the device object for the given node id */
function computeDeviceId(nodeId) {
    return `Node_${strings_1.padStart(nodeId.toString(), 3, "0")}`;
}
exports.computeDeviceId = computeDeviceId;
function mapToRecord(map) {
    const ret = {};
    for (const [k, v] of map) {
        ret[k] = v;
    }
    return ret;
}
exports.mapToRecord = mapToRecord;
//# sourceMappingURL=shared.js.map