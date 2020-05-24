"use strict";
// wotan-disable async-function-assignability
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("@iobroker/adapter-core");
const objects_1 = require("alcalzone-shared/objects");
const fs = require("fs-extra");
const path = require("path");
const zwave_js_1 = require("zwave-js");
const CommandClass_1 = require("zwave-js/CommandClass");
const global_1 = require("./lib/global");
const objects_2 = require("./lib/objects");
const shared_1 = require("./lib/shared");
class ZWave2 extends utils.Adapter {
    constructor(options = {}) {
        super(Object.assign(Object.assign({}, options), { name: "zwave2", objects: true }));
        this.driverReady = false;
        this.readyNodes = new Set();
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
        // Clear cache if we're asked to
        const cacheDir = path.join(utils.getAbsoluteInstanceDataDir(this), "cache");
        if (!!this.config.clearCache) {
            // Remove cache dir if it exists
            await fs.remove(cacheDir);
            // Don't do that next time we start
            this.updateConfig({ clearCache: false });
            return;
        }
        await this.subscribeStatesAsync("*");
        // Reset all control states
        this.setState("info.connection", false, true);
        this.setState(`info.inclusion`, false, true);
        this.setState(`info.exclusion`, false, true);
        this.setState("info.healingNetwork", false, true);
        if (!this.config.serialport) {
            this.log.warn("No serial port configured. Please select one in the adapter settings!");
            return;
        }
        // Enable zwave-js logging
        if (this.config.writeLogFile) {
            process.env.LOGTOFILE = "true";
        }
        this.driver = new zwave_js_1.Driver(this.config.serialport, {
            cacheDir,
        });
        this.driver.once("driver ready", async () => {
            this.driverReady = true;
            this.setState("info.connection", true, true);
            this.log.info(`The driver is ready. Found ${this.driver.controller.nodes.size} nodes.`);
            this.driver.controller
                .on("inclusion started", this.onInclusionStarted.bind(this))
                .on("exclusion started", this.onExclusionStarted.bind(this))
                .on("inclusion stopped", this.onInclusionStopped.bind(this))
                .on("exclusion stopped", this.onExclusionStopped.bind(this))
                .on("inclusion failed", this.onInclusionFailed.bind(this))
                .on("exclusion failed", this.onExclusionFailed.bind(this))
                .on("node added", this.onNodeAdded.bind(this))
                .on("node removed", this.onNodeRemoved.bind(this))
                .on("heal network progress", this.onHealNetworkProgress.bind(this))
                .on("heal network done", this.onHealNetworkDone.bind(this));
            for (const [nodeId, node] of this.driver.controller.nodes) {
                // Reset the node status
                await objects_2.setNodeStatus(nodeId, objects_2.nodeStatusToStatusState(node.status));
                await objects_2.setNodeReady(nodeId, node.ready);
                this.addNodeEventHandlers(node);
                // Make sure we didn't miss the ready event
                if (node.ready)
                    void this.onNodeReady(node);
            }
            // Now we know which nodes should exist - clean up orphaned nodes
            const nodeIdRegex = new RegExp(`^${this.name}\\.${this.instance}\\.Node_(\\d+)`);
            const existingNodeIds = Object.keys(await global_1.Global.$$(`${this.namespace}.*`, { type: "device" }))
                .map((id) => { var _a; return (_a = id.match(nodeIdRegex)) === null || _a === void 0 ? void 0 : _a[1]; })
                .filter((id) => !!id)
                .map((id) => parseInt(id, 10))
                .filter((id, index, all) => all.indexOf(id) === index);
            const unusedNodeIds = existingNodeIds.filter((id) => !this.driver.controller.nodes.has(id));
            for (const nodeId of unusedNodeIds) {
                this.log.warn(`Deleting orphaned node ${nodeId}`);
                await objects_2.removeNode(nodeId);
            }
        });
        // Log errors from the Z-Wave lib
        this.driver.on("error", this.onZWaveError.bind(this));
        this.driver.once("all nodes ready", () => {
            this.log.info("All nodes are ready to use");
        });
        try {
            await this.driver.start();
        }
        catch (e) {
            this.log.error(`The Z-Wave driver could not be started: ${e.message}`);
        }
    }
    async onInclusionStarted() {
        this.log.info("inclusion started");
        await this.setStateAsync("info.inclusion", true, true);
    }
    async onExclusionStarted() {
        this.log.info("exclusion started");
        await this.setStateAsync("info.exclusion", true, true);
    }
    async onInclusionStopped() {
        this.log.info("inclusion stopped");
        await this.setStateAsync("info.inclusion", false, true);
    }
    async onExclusionStopped() {
        this.log.info("exclusion stopped");
        await this.setStateAsync("info.exclusion", false, true);
    }
    async onInclusionFailed() {
        this.log.info("inclusion failed");
        await this.setStateAsync("info.inclusion", false, true);
    }
    async onExclusionFailed() {
        this.log.info("exclusion failed");
        await this.setStateAsync("info.exclusion", false, true);
    }
    async onNodeAdded(node) {
        this.log.info(`Node ${node.id}: added`);
        this.addNodeEventHandlers(node);
    }
    async onNodeRemoved(node) {
        this.log.info(`Node ${node.id}: removed`);
        node.removeAllListeners();
        await objects_2.removeNode(node.id);
    }
    async onHealNetworkProgress(progress) {
        const allDone = [...progress.values()].every((v) => v !== "pending");
        // If this is the final progress report, skip it, so the frontend gets the "done" message
        if (allDone)
            return;
        this.respondToHealNetworkPoll({
            type: "progress",
            progress: shared_1.mapToRecord(progress),
        });
    }
    async onHealNetworkDone(result) {
        this.respondToHealNetworkPoll({
            type: "done",
            progress: shared_1.mapToRecord(result),
        });
        this.setState("info.healingNetwork", false, true);
    }
    addNodeEventHandlers(node) {
        node.once("ready", this.onNodeReady.bind(this))
            .once("interview completed", this.onNodeInterviewCompleted.bind(this))
            .on("wake up", this.onNodeWakeUp.bind(this))
            .on("sleep", this.onNodeSleep.bind(this))
            .on("alive", this.onNodeAlive.bind(this))
            .on("dead", this.onNodeDead.bind(this))
            .on("value added", this.onNodeValueAdded.bind(this))
            .on("value updated", this.onNodeValueUpdated.bind(this))
            .on("value removed", this.onNodeValueRemoved.bind(this))
            .on("metadata updated", this.onNodeMetadataUpdated.bind(this));
    }
    async onNodeReady(node) {
        // Only execute this once
        if (this.readyNodes.has(node.id))
            return;
        this.readyNodes.add(node.id);
        this.log.info(`Node ${node.id}: ready to use`);
        const nodeAbsoluteId = `${this.namespace}.${shared_1.computeDeviceId(node.id)}`;
        // Make sure the device object exists and is up to date
        await objects_2.extendNode(node);
        // Set the node status
        await objects_2.setNodeStatus(node.id, node.supportsCC(CommandClass_1.CommandClasses["Wake Up"]) ? "awake" : "alive");
        await objects_2.setNodeReady(node.id, true);
        // Skip channel creation for the controller node
        if (node.isControllerNode())
            return;
        // Find out which channels and states need to exist
        const allValueIDs = node.getDefinedValueIDs();
        const uniqueCCs = allValueIDs
            .map((vid) => [vid.commandClass, vid.commandClassName])
            .filter(([cc], index, arr) => arr.findIndex(([_cc]) => _cc === cc) === index);
        const desiredChannelIds = new Set(uniqueCCs.map(([, ccName]) => `${this.namespace}.${objects_2.computeChannelId(node.id, ccName)}`));
        const existingChannelIds = Object.keys(await global_1.Global.$$(`${nodeAbsoluteId}.*`, {
            type: "channel",
        }));
        const desiredStateIds = new Set(allValueIDs.map((vid) => `${this.namespace}.${objects_2.computeId(node.id, vid)}`));
        const existingStateIds = Object.keys(await global_1.Global.$$(`${nodeAbsoluteId}.*`, {
            type: "state",
        }));
        // Clean up unused channels and states
        const unusedChannels = existingChannelIds.filter((id) => !desiredChannelIds.has(id));
        for (const id of unusedChannels) {
            this.log.warn(`Deleting orphaned channel ${id}`);
            try {
                await this.delObjectAsync(id);
            }
            catch (e) {
                /* it's fine */
            }
        }
        const unusedStates = existingStateIds
            // select those states that are not desired
            .filter((id) => !desiredStateIds.has(id))
            // filter out those states that are not under a CC channel
            .filter((id) => id.slice(nodeAbsoluteId.length + 1).includes("."));
        for (const id of unusedStates) {
            this.log.warn(`Deleting orphaned state ${id}`);
            try {
                await this.delStateAsync(id);
            }
            catch (e) {
                /* it's fine */
            }
            try {
                await this.delObjectAsync(id);
            }
            catch (e) {
                /* it's fine */
            }
        }
        // Make sure all channel objects are up to date
        for (const [cc, ccName] of uniqueCCs) {
            await objects_2.extendCC(node, cc, ccName);
        }
        // Prepare data points for all the node's values
        for (const valueId of allValueIDs) {
            const value = node.getValue(valueId);
            await objects_2.extendValue(node, Object.assign(Object.assign({}, valueId), { newValue: value }));
        }
    }
    async onNodeInterviewCompleted(node) {
        this.log.info(`Node ${node.id}: interview completed, all values are updated`);
    }
    async onNodeWakeUp(node) {
        await objects_2.setNodeStatus(node.id, "awake");
        this.log.info(`Node ${node.id}: is now awake`);
    }
    async onNodeSleep(node) {
        await objects_2.setNodeStatus(node.id, "asleep");
        this.log.info(`Node ${node.id}: is now asleep`);
    }
    async onNodeAlive(node) {
        await objects_2.setNodeStatus(node.id, "alive");
        this.log.info(`Node ${node.id}: has returned from the dead`);
    }
    async onNodeDead(node) {
        await objects_2.setNodeStatus(node.id, "dead");
        this.log.info(`Node ${node.id}: is now dead`);
    }
    async onNodeValueAdded(node, args) {
        let propertyName = objects_2.computeId(node.id, args);
        propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
        this.log.debug(`Node ${node.id}: value added: ${propertyName} => ${args.newValue}`);
        await objects_2.extendValue(node, args);
    }
    async onNodeValueUpdated(node, args) {
        let propertyName = objects_2.computeId(node.id, args);
        propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
        this.log.debug(`Node ${node.id}: value updated: ${propertyName} => ${args.newValue}`);
        await objects_2.extendValue(node, args);
    }
    async onNodeValueRemoved(node, args) {
        let propertyName = objects_2.computeId(node.id, args);
        propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
        this.log.debug(`Node ${node.id}: value removed: ${propertyName}`);
        await objects_2.removeValue(node.id, args);
    }
    async onNodeMetadataUpdated(node, args) {
        let propertyName = objects_2.computeId(node.id, args);
        propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
        this.log.debug(`Node ${node.id}: metadata updated: ${propertyName}`);
        await objects_2.extendMetadata(node, args);
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    async onUnload(callback) {
        try {
            this.log.info("Shutting down driver...");
            const allNodeIds = [...this.driver.controller.nodes.keys()];
            await this.driver.destroy();
            this.log.info("Resetting node status...");
            for (const nodeId of allNodeIds) {
                await objects_2.setNodeStatus(nodeId, "unknown");
                await objects_2.setNodeReady(nodeId, false);
            }
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
            if (!state.ack) {
                // Make sure we can already use the Z-Wave driver
                if (!this.driverReady) {
                    this.log.warn(`The driver is not yet ready, ignoring state change for "${id}"`);
                    return;
                }
                // Handle some special states first
                if (id.endsWith("info.inclusion")) {
                    if (state.val)
                        await this.setExclusionMode(false);
                    await this.setInclusionMode(state.val);
                    return;
                }
                else if (id.endsWith("info.exclusion")) {
                    if (state.val)
                        await this.setInclusionMode(false);
                    await this.setExclusionMode(state.val);
                    return;
                }
                // Otherwise perform the default handling for values
                const obj = this.oObjects[id];
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
                    await this.setStateAsync(id, { val: state.val, ack: true });
                }
                catch (e) {
                    this.log.error(e.message);
                }
            }
        } /* else {
            // The state was deleted
        } */
    }
    async setInclusionMode(active) {
        try {
            if (active) {
                await this.driver.controller.beginInclusion();
            }
            else {
                await this.driver.controller.stopInclusion();
            }
        }
        catch (e) {
            /* nothing to do */
        }
    }
    async setExclusionMode(active) {
        try {
            if (active) {
                await this.driver.controller.beginExclusion();
            }
            else {
                await this.driver.controller.stopExclusion();
            }
        }
        catch (e) {
            /* nothing to do */
        }
    }
    /** Responds to a pending poll from the frontend (if there is a message outstanding) */
    respondToHealNetworkPoll(response) {
        if (typeof this.healNetworkPollCallback === "function") {
            // If the client is waiting for a response, send it immediately
            this.healNetworkPollCallback(response);
            this.healNetworkPollCallback = undefined;
        }
        else {
            // otherwise remember the response for the next call
            this.healNetworkPollResponse = response;
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
            COMMAND_ACTIVE: { error: "command already active" },
            RESULT: (result) => ({ error: null, result }),
            ERROR: (error) => ({ error }),
        };
        function requireParams(...params) {
            if (!params.length)
                return true;
            for (const param of params) {
                if (!(obj.message && obj.message.hasOwnProperty(param))) {
                    respond(responses.MISSING_PARAMETER(param));
                    return false;
                }
            }
            return true;
        }
        // wotan-disable-next-line no-useless-predicate
        if (obj) {
            switch (obj.command) {
                case "getNetworkMap": {
                    if (!this.driverReady) {
                        return respond(responses.ERROR("The driver is not yet ready to show the network map!"));
                    }
                    const map = [...this.driver.controller.nodes.values()].map((node) => ({
                        id: node.id,
                        name: `Node ${node.id}`,
                        neighbors: node.neighbors,
                    }));
                    respond(responses.RESULT(map));
                    return;
                }
                case "getSerialPorts": {
                    try {
                        const ports = await zwave_js_1.Driver.enumerateSerialPorts();
                        respond(responses.RESULT(ports));
                    }
                    catch (e) {
                        if (e.code === "ENOENT" && /udevadm/.test(e.message)) {
                            // This can happen on linux, however serialport does not handle the error
                            respond(responses.ERROR("udevadm was not found on PATH"));
                            this.log.warn(`Cannot list serial ports because "udevadm" was not found on PATH!`);
                            this.log.warn(`If it is installed, add it to the PATH env variable.`);
                            this.log.warn(`Otherwise, install it using "apt install udev"`);
                        }
                        else {
                            respond(responses.ERROR(e.message));
                        }
                    }
                    return;
                }
                case "beginHealingNetwork": {
                    if (!this.driverReady) {
                        return respond(responses.ERROR("The driver is not yet ready to heal the network!"));
                    }
                    const result = this.driver.controller.beginHealingNetwork();
                    if (result) {
                        respond(responses.OK);
                        this.setState("info.healingNetwork", true, true);
                    }
                    else {
                        respond(responses.COMMAND_ACTIVE);
                    }
                    return;
                }
                case "stopHealingNetwork": {
                    if (!this.driverReady) {
                        return respond(responses.ERROR("The driver is not yet ready to heal the network!"));
                    }
                    this.driver.controller.stopHealingNetwork();
                    respond(responses.OK);
                    this.setState("info.healingNetwork", false, true);
                    return;
                }
                case "healNetworkPoll": {
                    if (this.healNetworkPollResponse) {
                        // if a response is waiting to be asked for, send it immediately
                        respond(responses.RESULT(this.healNetworkPollResponse));
                        this.healNetworkPollResponse = undefined;
                    }
                    else {
                        // otherwise remember the callback for a later response
                        this.respondToHealNetworkPoll = (result) => respond(responses.RESULT(result));
                    }
                    return;
                }
                case "clearCache": {
                    this.updateConfig({ clearCache: true });
                    respond(responses.OK);
                    return;
                }
                case "removeFailedNode": {
                    if (!this.driverReady) {
                        return respond(responses.ERROR("The driver is not yet ready to do that!"));
                    }
                    if (!requireParams("nodeId"))
                        return;
                    const params = obj.message;
                    try {
                        await this.driver.controller.removeFailedNode(params.nodeId);
                    }
                    catch (e) {
                        return respond(responses.ERROR(`Could not remove node ${params.nodeId}: ${e.message}`));
                    }
                    return respond(responses.OK);
                }
                case "getAssociationGroups": {
                    if (!this.driverReady) {
                        return respond(responses.ERROR("The driver is not yet ready to do that!"));
                    }
                    if (!requireParams("nodeId"))
                        return;
                    const params = obj.message;
                    const nodeId = params.nodeId;
                    try {
                        const groups = this.driver.controller.getAssociationGroups(nodeId);
                        // convert map into object
                        const ret = objects_1.composeObject([...groups]);
                        return respond(responses.RESULT(ret));
                    }
                    catch (e) {
                        return respond(responses.ERROR(`Could not get association groups for node ${params.nodeId}: ${e.message}`));
                    }
                }
                case "getAssociations": {
                    if (!this.driverReady) {
                        return respond(responses.ERROR("The driver is not yet ready to do that!"));
                    }
                    if (!requireParams("nodeId"))
                        return;
                    const params = obj.message;
                    const nodeId = params.nodeId;
                    try {
                        const assocs = this.driver.controller.getAssociations(nodeId);
                        // convert map into object
                        const ret = objects_1.composeObject([...assocs]);
                        return respond(responses.RESULT(ret));
                    }
                    catch (e) {
                        return respond(responses.ERROR(`Could not get associations for node ${params.nodeId}: ${e.message}`));
                    }
                }
                case "addAssociation": {
                    if (!this.driverReady) {
                        return respond(responses.ERROR("The driver is not yet ready to do that!"));
                    }
                    if (!requireParams("nodeId", "association"))
                        return;
                    const params = obj.message;
                    const nodeId = params.nodeId;
                    const definition = params.association;
                    try {
                        await this.driver.controller.addAssociations(nodeId, definition.groupId, [
                            {
                                nodeId: definition.targetNodeId,
                                endpoint: definition.endpoint,
                            },
                        ]);
                        return respond(responses.OK);
                    }
                    catch (e) {
                        return respond(responses.ERROR(`Could not add association for node ${params.nodeId}: ${e.message}`));
                    }
                }
                case "removeAssociation": {
                    if (!this.driverReady) {
                        return respond(responses.ERROR("The driver is not yet ready to do that!"));
                    }
                    if (!requireParams("nodeId", "association"))
                        return;
                    const params = obj.message;
                    const nodeId = params.nodeId;
                    const definition = params.association;
                    try {
                        await this.driver.controller.removeAssociations(nodeId, definition.groupId, [
                            {
                                nodeId: definition.targetNodeId,
                                endpoint: definition.endpoint,
                            },
                        ]);
                        return respond(responses.OK);
                    }
                    catch (e) {
                        return respond(responses.ERROR(`Could not remove association for node ${params.nodeId}: ${e.message}`));
                    }
                }
            }
        }
    }
}
exports.ZWave2 = ZWave2;
if (module.parent) {
    // Export the constructor in compact mode
    module.exports = (options) => new ZWave2(options);
}
else {
    // otherwise start the instance directly
    (() => new ZWave2())();
}
process.on("unhandledRejection", (r) => {
    throw r;
});
//# sourceMappingURL=main.js.map