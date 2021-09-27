var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};
__markAsModule(exports);
__export(exports, {
  getVirtualValueIDs: () => getVirtualValueIDs
});
var import_core = __toModule(require("@zwave-js/core"));
var import_arrays = __toModule(require("alcalzone-shared/arrays"));
function getVirtualValueIDs(node) {
  if (node.physicalNodes.every((n) => n.isSecure === true))
    return [];
  const ret = new Map();
  for (const pNode of node.physicalNodes) {
    if (pNode.isSecure === true)
      continue;
    const valueIDs = pNode.getDefinedValueIDs().filter((v) => import_core.actuatorCCs.includes(v.commandClass));
    for (const valueId of valueIDs) {
      const mapKey = (0, import_core.valueIdToString)(valueId);
      const ccVersion = pNode.getCCVersion(valueId.commandClass);
      const metadata = pNode.getValueMetadata(valueId);
      if (!metadata.writeable)
        continue;
      const needsUpdate = !ret.has(mapKey) || ret.get(mapKey).ccVersion < ccVersion;
      if (needsUpdate) {
        ret.set(mapKey, __spreadProps(__spreadValues({}, valueId), {
          ccVersion,
          metadata: pNode.getValueMetadata(valueId)
        }));
      }
    }
  }
  const exposedEndpoints = (0, import_arrays.distinct)([...ret.values()].map((v) => v.endpoint).filter((e) => e !== void 0));
  for (const endpoint of exposedEndpoints) {
    const valueId = {
      commandClass: import_core.CommandClasses.Basic,
      commandClassName: "Basic",
      endpoint,
      property: "targetValue",
      propertyName: "Target value"
    };
    const ccVersion = 1;
    const metadata = __spreadProps(__spreadValues({}, import_core.ValueMetadata.WriteOnlyUInt8), {
      label: "Target value"
    });
    ret.set((0, import_core.valueIdToString)(valueId), __spreadProps(__spreadValues({}, valueId), {
      ccVersion,
      metadata
    }));
  }
  return [...ret.values()];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getVirtualValueIDs
});
//# sourceMappingURL=zwave.js.map
