"use strict";
// wotan-disable async-function-assignability
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("@iobroker/adapter-core");
const zwave_js_1 = require("zwave-js");
const CommandClasses_1 = require("zwave-js/build/lib/commandclass/CommandClasses");
const global_1 = require("./lib/global");
const objects_1 = require("./lib/objects");
class Zwave2 extends utils.Adapter {
    constructor(options = {}) {
        super(Object.assign(Object.assign({}, options), { name: "zwave2" }));
        this.on("ready", this.onReady.bind(this));
        this.on("objectChange", this.onObjectChange.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Make adapter instance global
        global_1.Global.adapter = this;
        await this.subscribeStatesAsync("*");
        this.setState("info.connection", false, true);
        if (!this.config.serialport) {
            this.log.warn("No serial port configured. Please select one in the adapter settings!");
            return;
        }
        this.driver = new zwave_js_1.Driver(this.config.serialport);
        this.driver.once("driver ready", () => {
            this.setState("info.connection", true, true);
            this.log.info(`The driver is ready. Found ${this.driver.controller.nodes.size} nodes.`);
            this.driver.controller.nodes.forEach(this.addNodeEventHandlers.bind(this));
        });
        await this.driver.start();
    }
    addNodeEventHandlers(node) {
        node.once("interview completed", this.onNodeInterviewCompleted.bind(this))
            .on("wake up", this.onNodeWakeUp.bind(this))
            .on("sleep", this.onNodeSleep.bind(this))
            .on("alive", this.onNodeAlive.bind(this))
            .on("dead", this.onNodeDead.bind(this))
            .on("value added", this.onNodeValueAdded.bind(this))
            .on("value updated", this.onNodeValueUpdated.bind(this))
            .on("value removed", this.onNodeValueRemoved.bind(this))
            .on("metadata updated", this.onNodeMetadataUpdated.bind(this));
    }
    async onNodeInterviewCompleted(node) {
        this.log.info(`Node ${node.id}: interview completed`);
        // Prepare data points for all the node's values
        for (const valueId of node.getDefinedValueIDs()) {
            const value = node.getValue(valueId);
            await objects_1.extendValue(node, Object.assign(Object.assign({}, valueId), { newValue: value, commandClassName: CommandClasses_1.getCCName(valueId.commandClass) }));
        }
    }
    onNodeWakeUp(node) {
        this.log.info(`Node ${node.id}: is now awake`);
    }
    onNodeSleep(node) {
        this.log.info(`Node ${node.id}: is now asleep`);
    }
    onNodeAlive(node) {
        this.log.info(`Node ${node.id}: has returned from the dead`);
    }
    onNodeDead(node) {
        this.log.info(`Node ${node.id}: is now dead`);
    }
    async onNodeValueAdded(node, args) {
        this.log.info(`Node ${node.id}: value added: ${args.propertyName} => ${args.newValue}`);
        await objects_1.extendValue(node, args);
    }
    async onNodeValueUpdated(node, args) {
        this.log.info(`Node ${node.id}: value updated: ${args.propertyName} => ${args.newValue}`);
        await objects_1.extendValue(node, args);
    }
    async onNodeValueRemoved(node, args) {
        this.log.info(`Node ${node.id}: value removed: ${args.propertyName}`);
        await objects_1.removeValue(node.id, args);
    }
    async onNodeMetadataUpdated(node, args) {
        this.log.info(`Node ${node.id}: metadata updated: ${args.propertyName}`);
        await objects_1.extendMetadata(node, args);
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    async onUnload(callback) {
        try {
            this.log.info("Shutting down driver...");
            await this.driver.destroy();
            this.log.info("Cleaned everything up!");
            callback();
        }
        catch (e) {
            callback();
        }
    }
    /**
     * Is called if a subscribed object changes
     */
    onObjectChange(id, obj) {
        if (obj) {
            // The object was changed
            this.log.debug(`object ${id} changed: ${JSON.stringify(obj)}`);
        }
        else {
            // The object was deleted
            this.log.debug(`object ${id} deleted`);
        }
    }
    /**
     * Is called if a subscribed state changes
     */
    async onStateChange(id, state) {
        if (state) {
            // The state was changed
            this.log.debug(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
            if (!state.ack) {
                const { native } = (await this.getObjectAsync(id));
                const nodeId = native.nodeId;
                if (!nodeId) {
                    this.log.error(`Node ID missing from object definition ${id}!`);
                    return;
                }
                const valueId = native.valueId;
                if (!(valueId && valueId.commandClass && valueId.propertyName)) {
                    this.log.error(`Value ID missing or incomplete in object definition ${id}!`);
                    return;
                }
                const node = this.driver.controller.nodes.get(nodeId);
                if (!node) {
                    this.log.error(`Node ${nodeId} does not exist!`);
                    return;
                }
                try {
                    await node.setValue(valueId, state.val);
                    await this.setStateAsync(id, state.val, true);
                }
                catch (e) {
                    this.log.error(e.message);
                }
            }
        }
        else {
            // The state was deleted
            this.log.debug(`state ${id} deleted`);
        }
    }
    /**
     * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
     * Using this method requires "common.message" property to be set to true in io-package.json
     */
    async onMessage(obj) {
        // responds to the adapter that sent the original message
        const respond = (response) => {
            // wotan-disable-next-line no-useless-predicate
            if (obj.callback)
                this.sendTo(obj.from, obj.command, response, obj.callback);
        };
        // some predefined responses so we only have to define them once
        const responses = {
            ACK: { error: null },
            OK: { error: null, result: "ok" },
            ERROR_UNKNOWN_COMMAND: { error: "Unknown command!" },
            MISSING_PARAMETER: (paramName) => {
                return { error: 'missing parameter "' + paramName + '"!' };
            },
            COMMAND_RUNNING: { error: "command running" },
            RESULT: (result) => ({ error: null, result }),
            ERROR: (error) => ({ error }),
        };
        // make required parameters easier
        // function requireParams(...params: string[]): boolean {
        // 	if (!params.length) return true;
        // 	for (const param of params) {
        // 		if (!(obj.message && obj.message.hasOwnProperty(param))) {
        // 			respond(responses.MISSING_PARAMETER(param));
        // 			return false;
        // 		}
        // 	}
        // 	return true;
        // }
        // wotan-disable-next-line no-useless-predicate
        if (obj) {
            switch (obj.command) {
                case "getNetworkMap": {
                    let controller;
                    try {
                        controller = this.driver.controller;
                    }
                    catch (e) {
                        return respond(responses.ERROR("The driver is not yet ready to show the network map!"));
                    }
                    const map = [...controller.nodes.values()].map(node => ({
                        id: node.id,
                        name: `Node ${node.id}`,
                        neighbors: node.neighbors,
                    }));
                    respond(responses.RESULT(map));
                    return;
                }
                case "getSerialPorts": {
                    const ports = await zwave_js_1.Driver.enumerateSerialPorts();
                    respond(responses.RESULT(ports));
                    return;
                }
            }
        }
    }
}
if (module.parent) {
    // Export the constructor in compact mode
    module.exports = (options) => new Zwave2(options);
}
else {
    // otherwise start the instance directly
    (() => new Zwave2())();
}
process.on("unhandledRejection", r => {
    throw r;
});
//# sourceMappingURL=main.js.map