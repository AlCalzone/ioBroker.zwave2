"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Global {
    static get adapter() {
        return Global._adapter;
    }
    static set adapter(adapter) {
        Global._adapter = adapter;
    }
}
exports.Global = Global;
//# sourceMappingURL=global.js.map