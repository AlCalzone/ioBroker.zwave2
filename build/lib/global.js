"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
const objects_1 = require("alcalzone-shared/objects");
class Global {
    static get adapter() {
        return Global._adapter;
    }
    static set adapter(adapter) {
        Global._adapter = adapter;
    }
    /**
     * Kurzschreibweise für die Ermittlung mehrerer Objekte
     * @param id
     */
    static async $$(pattern, options = {}) {
        const { type, role } = options;
        const objects = await Global._adapter.getForeignObjectsAsync(pattern, type);
        if (role) {
            return objects_1.filter(objects, (o) => o.common.role === role);
        }
        else {
            return objects;
        }
    }
}
exports.Global = Global;
//# sourceMappingURL=global.js.map