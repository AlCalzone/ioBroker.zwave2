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
var global_exports = {};
__export(global_exports, {
  Global: () => Global
});
var import_objects = require("alcalzone-shared/objects");
class Global {
  static get adapter() {
    return Global._adapter;
  }
  static set adapter(adapter) {
    Global._adapter = adapter;
  }
  static async $$(pattern, options = {}) {
    const { type, role } = options;
    const objects = await Global._adapter.getForeignObjectsAsync(pattern, type);
    if (role) {
      return (0, import_objects.filter)(objects, (o) => o.common.role === role);
    } else {
      return objects;
    }
  }
}
module.exports = __toCommonJS(global_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Global
});
//# sourceMappingURL=global.js.map
