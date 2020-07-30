"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InclusionMode = exports.mapToRecord = exports.computeDeviceId = void 0;
const strings_1 = require("alcalzone-shared/strings");
// WARNING: DO NOT IMPORT values FROM "zwave-js" HERE
// That will break the frontend
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
var InclusionMode;
(function (InclusionMode) {
    InclusionMode[InclusionMode["Idle"] = 0] = "Idle";
    InclusionMode[InclusionMode["NonSecure"] = 1] = "NonSecure";
    InclusionMode[InclusionMode["Secure"] = 2] = "Secure";
})(InclusionMode = exports.InclusionMode || (exports.InclusionMode = {}));
//# sourceMappingURL=shared.js.map