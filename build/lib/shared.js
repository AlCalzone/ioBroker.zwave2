var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var shared_exports = {};
__export(shared_exports, {
  buffer2hex: () => buffer2hex,
  bufferFromHex: () => bufferFromHex,
  computeDeviceId: () => computeDeviceId,
  getDefaultControllerStatistics: () => getDefaultControllerStatistics,
  getDefaultNodeStatistics: () => getDefaultNodeStatistics,
  getErrorMessage: () => getErrorMessage,
  isBufferAsHex: () => isBufferAsHex,
  mapToRecord: () => mapToRecord
});
var import_strings = require("alcalzone-shared/strings");
function computeDeviceId(nodeId) {
  return `Node_${(0, import_strings.padStart)(nodeId.toString(), 3, "0")}`;
}
function mapToRecord(map) {
  const ret = {};
  for (const [k, v] of map) {
    ret[k] = v;
  }
  return ret;
}
function buffer2hex(buffer) {
  if (buffer.length === 0)
    return "";
  return `0x${buffer.toString("hex")}`;
}
function bufferFromHex(hex) {
  return Buffer.from(hex.substr(2), "hex");
}
function isBufferAsHex(str) {
  return /^0x([a-fA-F0-9]{2})+$/.test(str);
}
function getErrorMessage(e, includeStack) {
  if (e instanceof Error)
    return includeStack && e.stack ? e.stack : e.message;
  return String(e);
}
function getDefaultControllerStatistics() {
  return {
    CAN: 0,
    NAK: 0,
    messagesDroppedRX: 0,
    messagesDroppedTX: 0,
    messagesRX: 0,
    messagesTX: 0,
    timeoutACK: 0,
    timeoutCallback: 0,
    timeoutResponse: 0
  };
}
function getDefaultNodeStatistics() {
  return {
    commandsRX: 0,
    commandsTX: 0,
    commandsDroppedRX: 0,
    commandsDroppedTX: 0,
    timeoutResponse: 0
  };
}
module.exports = __toCommonJS(shared_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buffer2hex,
  bufferFromHex,
  computeDeviceId,
  getDefaultControllerStatistics,
  getDefaultNodeStatistics,
  getErrorMessage,
  isBufferAsHex,
  mapToRecord
});
//# sourceMappingURL=shared.js.map
