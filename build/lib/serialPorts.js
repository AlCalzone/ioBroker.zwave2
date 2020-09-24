"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumerateSerialPorts = void 0;
const arrays_1 = require("alcalzone-shared/arrays");
const fs = require("fs-extra");
const path = require("path");
const zwave_js_1 = require("zwave-js");
function isSerialPort(path) {
    // get only serial port names
    if (!/(tty(S|ACM|USB|AMA|MFD)|rfcomm)/.test(path))
        return false;
    return fs.statSync(path).isCharacterDevice();
}
async function enumerateSerialPorts(adapter) {
    const result = [];
    // On Linux, search the /dev dir for serial ports
    const devDirName = "/dev";
    try {
        result.push(...(await fs.readdir(devDirName))
            .map((file) => path.join(devDirName, file))
            .filter(isSerialPort));
    }
    catch (_a) { }
    // Also try to use the serial port library to find serial ports
    try {
        result.push(...(await zwave_js_1.Driver.enumerateSerialPorts()));
    }
    catch (e) {
        if (e.code === "ENOENT" && /udevadm/.test(e.message)) {
            adapter.log.warn(`Cannot list serial ports because "udevadm" was not found on PATH!`);
            adapter.log.warn(`If it is installed, add it to the PATH env variable.`);
            adapter.log.warn(`Otherwise, install it using "apt install udev"`);
        }
    }
    return arrays_1.distinct(result).sort();
}
exports.enumerateSerialPorts = enumerateSerialPorts;
//# sourceMappingURL=serialPorts.js.map