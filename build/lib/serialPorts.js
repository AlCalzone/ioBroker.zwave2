var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var serialPorts_exports = {};
__export(serialPorts_exports, {
  enumerateSerialPorts: () => enumerateSerialPorts
});
var import_arrays = require("alcalzone-shared/arrays");
var import_fs_extra = __toESM(require("fs-extra"));
var import_path = __toESM(require("path"));
var import_zwave_js = require("zwave-js");
function isSerialPort(path2) {
  if (!/(tty(S|ACM|USB|AMA|MFD)|rfcomm)/.test(path2))
    return false;
  return import_fs_extra.default.statSync(path2).isCharacterDevice();
}
async function enumerateSerialPorts(adapter) {
  const result = [];
  const devDirName = "/dev";
  try {
    result.push(...(await import_fs_extra.default.readdir(devDirName)).map((file) => import_path.default.join(devDirName, file)).filter(isSerialPort));
  } catch {
  }
  try {
    result.push(...await import_zwave_js.Driver.enumerateSerialPorts());
  } catch (e) {
    if (e.code === "ENOENT" && /udevadm/.test(e.message)) {
      adapter.log.warn(`Cannot list serial ports because "udevadm" was not found on PATH!`);
      adapter.log.warn(`If it is installed, add it to the PATH env variable.`);
      adapter.log.warn(`Otherwise, install it using "apt install udev"`);
    }
  }
  return (0, import_arrays.distinct)(result).sort();
}
module.exports = __toCommonJS(serialPorts_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  enumerateSerialPorts
});
//# sourceMappingURL=serialPorts.js.map
