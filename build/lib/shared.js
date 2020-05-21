"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strings_1 = require("alcalzone-shared/strings");
const zwave_js_1 = require("zwave-js");
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
function nodeStatusToStatusState(status) {
    switch (status) {
        case zwave_js_1.NodeStatus.Awake:
            return "awake";
        case zwave_js_1.NodeStatus.Asleep:
            return "asleep";
        case zwave_js_1.NodeStatus.Dead:
            return "dead";
        case zwave_js_1.NodeStatus.Unknown:
            return "unknown";
    }
}
exports.nodeStatusToStatusState = nodeStatusToStatusState;
//# sourceMappingURL=shared.js.map