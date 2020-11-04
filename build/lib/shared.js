"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InclusionMode = exports.isBufferAsHex = exports.bufferFromHex = exports.buffer2hex = exports.mapToRecord = exports.computeDeviceId = void 0;
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
function buffer2hex(buffer) {
    if (buffer.length === 0)
        return "";
    return `0x${buffer.toString("hex")}`;
}
exports.buffer2hex = buffer2hex;
/** Parses a buffer from a string has the form 0x[a-f0-9]+ */
function bufferFromHex(hex) {
    return Buffer.from(hex.substr(2), "hex");
}
exports.bufferFromHex = bufferFromHex;
function isBufferAsHex(str) {
    return /^0x([a-fA-F0-9]{2})+$/.test(str);
}
exports.isBufferAsHex = isBufferAsHex;
var InclusionMode;
(function (InclusionMode) {
    InclusionMode[InclusionMode["Idle"] = 0] = "Idle";
    InclusionMode[InclusionMode["NonSecure"] = 1] = "NonSecure";
    InclusionMode[InclusionMode["Secure"] = 2] = "Secure";
})(InclusionMode = exports.InclusionMode || (exports.InclusionMode = {}));
//# sourceMappingURL=shared.js.map