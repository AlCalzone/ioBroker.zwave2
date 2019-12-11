"use strict";
// wotan-disable async-function-assignability
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("@iobroker/adapter-core");
const zwave_js_1 = require("zwave-js");
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
        // Log errors from the Z-Wave lib
        this.driver.on("error", this.onZWaveError.bind(this));
        try {
            await this.driver.start();
        }
        catch (e) {
            this.log.error(`The Z-Wave driver could not be started: ${e.message}`);
        }
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
        if (node.isControllerNode())
            return;
        // Make sure the device object exists and is up to date
        await objects_1.extendNode(node);
        // Find out which channels and states need to exist
        const allValueIDs = node.getDefinedValueIDs();
        const uniqueCCs = allValueIDs
            .map(vid => [vid.commandClass, vid.commandClassName])
            .filter(([cc], index, arr) => arr.findIndex(([_cc]) => _cc === cc) === index);
        const desiredChannelIds = new Set(uniqueCCs.map(([, ccName]) => `${this.namespace}.${objects_1.computeChannelId(node.id, ccName)}`));
        const existingChannelIds = Object.keys(await global_1.Global.$$(`${this.namespace}.${objects_1.computeDeviceId(node.id)}.*`, {
            type: "channel",
        }));
        const desiredStateIds = new Set(allValueIDs.map(vid => `${this.namespace}.${objects_1.computeId(node.id, vid)}`));
        const existingStateIds = Object.keys(await global_1.Global.$$(`${this.namespace}.${objects_1.computeDeviceId(node.id)}.*`, {
            type: "state",
        }));
        // Clean up unused channels and states
        const unusedChannels = existingChannelIds.filter(id => !desiredChannelIds.has(id));
        for (const id of unusedChannels) {
            this.log.warn(`Deleting orphaned channel ${id}`);
            await this.delObjectAsync(id);
        }
        const unusedStates = existingStateIds.filter(id => !desiredStateIds.has(id));
        for (const id of unusedStates) {
            this.log.warn(`Deleting orphaned state ${id}`);
            await this.delStateAsync(id);
            await this.delObjectAsync(id);
        }
        // Make sure all channel objects are up to date
        for (const [cc, ccName] of uniqueCCs) {
            await objects_1.extendCC(node, cc, ccName);
        }
        // Prepare data points for all the node's values
        for (const valueId of allValueIDs) {
            const value = node.getValue(valueId);
            await objects_1.extendValue(node, Object.assign(Object.assign({}, valueId), { newValue: value }));
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
        let propertyName = objects_1.computeId(node.id, args);
        propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
        this.log.debug(`Node ${node.id}: value added: ${propertyName} => ${args.newValue}`);
        await objects_1.extendValue(node, args);
    }
    async onNodeValueUpdated(node, args) {
        let propertyName = objects_1.computeId(node.id, args);
        propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
        this.log.debug(`Node ${node.id}: value updated: ${propertyName} => ${args.newValue}`);
        await objects_1.extendValue(node, args);
    }
    async onNodeValueRemoved(node, args) {
        let propertyName = objects_1.computeId(node.id, args);
        propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
        this.log.debug(`Node ${node.id}: value removed: ${propertyName}`);
        await objects_1.removeValue(node.id, args);
    }
    async onNodeMetadataUpdated(node, args) {
        let propertyName = objects_1.computeId(node.id, args);
        propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
        this.log.debug(`Node ${node.id}: metadata updated: ${propertyName}`);
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
     * Is called when the Z-Wave lib has a non-critical error
     */
    async onZWaveError(error) {
        this.log.error(error.message);
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
                const obj = await this.getObjectAsync(id);
                if (!obj) {
                    this.log.error(`Object definition for state ${id} is missing!`);
                    // TODO: Capture this with sentry?
                    return;
                }
                const { native } = obj;
                const nodeId = native.nodeId;
                if (!nodeId) {
                    this.log.error(`Node ID missing from object definition ${id}!`);
                    return;
                }
                const valueId = native.valueId;
                if (!(valueId && valueId.commandClass && valueId.property)) {
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