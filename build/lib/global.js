"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var global_exports = {};
__export(global_exports, {
  Global: () => Global
});
module.exports = __toCommonJS(global_exports);
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
    const objects = await Global._adapter.getForeignObjectsAsync(
      pattern,
      type
    );
    if (role) {
      return (0, import_objects.filter)(objects, (o) => o.common.role === role);
    } else {
      return objects;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Global
});
//# sourceMappingURL=global.js.map
