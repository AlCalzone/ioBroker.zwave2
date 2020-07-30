"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guessFirmwareFormat = void 0;
function guessFirmwareFormat(filename, firmware) {
    if ((filename.endsWith(".exe") || filename.endsWith(".ex_")) &&
        firmware.includes(Buffer.from("Aeon Labs", "utf8"))) {
        return "aeotec";
    }
    else if (/\.(hex|ota|otz)$/.test(filename)) {
        return filename.slice(-3);
    }
    else {
        throw new Error("could not detect firmware format");
    }
}
exports.guessFirmwareFormat = guessFirmwareFormat;
//# sourceMappingURL=firmwareUpdate.js.map