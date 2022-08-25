"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var serialPorts_exports = {};
__export(serialPorts_exports, {
  enumerateSerialPorts: () => enumerateSerialPorts
});
module.exports = __toCommonJS(serialPorts_exports);
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
    result.push(
      ...(await import_fs_extra.default.readdir(devDirName)).map((file) => import_path.default.join(devDirName, file)).filter(isSerialPort)
    );
  } catch {
  }
  try {
    result.push(...await import_zwave_js.Driver.enumerateSerialPorts());
  } catch (e) {
    if (e.code === "ENOENT" && /udevadm/.test(e.message)) {
      adapter.log.warn(
        `Cannot list serial ports because "udevadm" was not found on PATH!`
      );
      adapter.log.warn(
        `If it is installed, add it to the PATH env variable.`
      );
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
