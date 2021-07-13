var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  enumerateSerialPorts: () => enumerateSerialPorts
});
var import_arrays = __toModule(require("alcalzone-shared/arrays"));
var fs = __toModule(require("fs-extra"));
var path = __toModule(require("path"));
var import_zwave_js = __toModule(require("zwave-js"));
function isSerialPort(path2) {
  if (!/(tty(S|ACM|USB|AMA|MFD)|rfcomm)/.test(path2))
    return false;
  return fs.statSync(path2).isCharacterDevice();
}
async function enumerateSerialPorts(adapter) {
  const result = [];
  const devDirName = "/dev";
  try {
    result.push(...(await fs.readdir(devDirName)).map((file) => path.join(devDirName, file)).filter(isSerialPort));
  } catch (e) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  enumerateSerialPorts
});
//# sourceMappingURL=serialPorts.js.map
