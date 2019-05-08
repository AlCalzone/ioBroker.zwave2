"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("@iobroker/adapter-core");
const zwave_js_1 = require("zwave-js");
class Zwave2 extends utils.Adapter {
    constructor(options = {}) {
        super(Object.assign({}, options, { name: "zwave2" }));
        this.on("ready", this.onReady.bind(this));
        this.on("objectChange", this.onObjectChange.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        this.setState("info.connection", false, true);
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
            .on("dead", this.onNodeDead.bind(this));
    }
    onNodeInterviewCompleted(node) {
        this.log.info(`Node ${node.id}: interview completed`);
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
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    async onUnload(callback) {
        try {
            await this.driver.destroy();
            this.log.info("cleaned everything up...");
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
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            this.log.debug(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        }
        else {
            // The state was deleted
            this.log.debug(`state ${id} deleted`);
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
