"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZWave2 = void 0;
const utils = require("@iobroker/adapter-core");
const core_1 = require("@zwave-js/core");
const objects_1 = require("alcalzone-shared/objects");
const typeguards_1 = require("alcalzone-shared/typeguards");
const fs = require("fs-extra");
const path = require("path");
const zwave_js_1 = require("zwave-js");
const firmwareUpdate_1 = require("./lib/firmwareUpdate");
const global_1 = require("./lib/global");
const objects_2 = require("./lib/objects");
const serialPorts_1 = require("./lib/serialPorts");
const shared_1 = require("./lib/shared");
class ZWave2 extends utils.Adapter {
    constructor(options = {}) {
        super(Object.assign(Object.assign({}, options), { name: "zwave2", objects: true }));
        this.driverReady = false;
        this.readyNodes = new Set();
        this.initialNodeInterviewStages = new Map();
        this.onNodeNotification = async (...params) => {
            if (params[1] === core_1.CommandClasses.Notification) {
                const [node, , args] = params;
                this.log.debug(`Node ${node.id}: received notification: ${args.label} - ${args.eventLabel}`);
                await objects_2.extendNotification_NotificationCC(node, args);
            }
        };
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
        var _a;
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
        this.setState(`info.inclusion`, shared_1.InclusionMode.Idle, true);
        this.setState(`info.exclusion`, false, true);
        this.setState("info.healingNetwork", false, true);
        if (!this.config.serialport) {
            this.log.warn("No serial port configured. Please select one in the adapter settings!");
            return;
        }
        // Apply adapter configuration
        const timeouts = this
            .config.driver_increaseTimeouts
            ? {
                ack: 2000,
                response: 3000,
            }
            : undefined;
        const attempts = this
            .config.driver_increaseSendAttempts
            ? {
                sendData: 5,
            }
            : undefined;
        const networkKey = ((_a = this.config.networkKey) === null || _a === void 0 ? void 0 : _a.length) === 32
            ? Buffer.from(this.config.networkKey, "hex")
            : undefined;
        this.driver = new zwave_js_1.Driver(this.config.serialport, {
            timeouts,
            attempts,
            logConfig: {
                logToFile: !!this.config.writeLogFile,
            },
            storage: {
                cacheDir,
            },
            networkKey,
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
            // Remember in which interview stage the nodes started, so we can decide whether to mark the node values as stale or not
            this.initialNodeInterviewStages = new Map([...this.driver.controller.nodes.values()].map((node) => [
                node.id,
                node.interviewStage,
            ]));
            for (const [nodeId, node] of this.driver.controller.nodes) {
                // Reset the node status
                await objects_2.setNodeStatus(nodeId, objects_2.nodeStatusToStatusState(node.status));
                await objects_2.setNodeReady(nodeId, node.ready);
                this.addNodeEventHandlers(node);
                if (node.ready) {
                    // If the node is already ready, sync the states with the cache
                    void this.onNodeReady(node);
                }
                else {
                    // Otherwise immediately populate ioBroker states with the already-known values from cache,
                    // so they can be overwritten with fresh ones later
                    await this.extendNodeObjectsAndStates(node);
                }
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
    async onInclusionStarted(secure) {
        this.log.info(`${secure ? "secure" : "non-secure"} inclusion started`);
        await this.setStateAsync("info.inclusion", secure ? shared_1.InclusionMode.Secure : shared_1.InclusionMode.NonSecure, true);
    }
    async onExclusionStarted() {
        this.log.info("exclusion started");
        await this.setStateAsync("info.exclusion", true, true);
    }
    async onInclusionStopped() {
        this.log.info("inclusion stopped");
        await this.setStateAsync("info.inclusion", shared_1.InclusionMode.Idle, true);
    }
    async onExclusionStopped() {
        this.log.info("exclusion stopped");
        await this.setStateAsync("info.exclusion", false, true);
    }
    async onInclusionFailed() {
        this.log.info("inclusion failed");
        await this.setStateAsync("info.inclusion", shared_1.InclusionMode.Idle, true);
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
        node.on("ready", this.onNodeReady.bind(this))
            .on("interview failed", this.onNodeInterviewFailed.bind(this))
            .on("interview completed", this.onNodeInterviewCompleted.bind(this))
            .on("wake up", this.onNodeWakeUp.bind(this))
            .on("sleep", this.onNodeSleep.bind(this))
            .on("alive", this.onNodeAlive.bind(this))
            .on("dead", this.onNodeDead.bind(this))
            .on("value added", this.onNodeValueAdded.bind(this))
            .on("value updated", this.onNodeValueUpdated.bind(this))
            .on("value removed", this.onNodeValueRemoved.bind(this))
            .on("value notification", this.onNodeValueNotification.bind(this))
            .on("metadata updated", this.onNodeMetadataUpdated.bind(this))
            .on("firmware update progress", this.onNodeFirmwareUpdateProgress.bind(this))
            .on("firmware update finished", this.onNodeFirmwareUpdateFinished.bind(this))
            .on("notification", this.onNodeNotification.bind(this));
    }
    async onNodeReady(node) {
        // Only execute this once
        if (this.readyNodes.has(node.id))
            return;
        this.readyNodes.add(node.id);
        this.log.info(`Node ${node.id}: ready to use`);
        // Set the node status
        await objects_2.setNodeStatus(node.id, node.id === this.driver.controller.ownNodeId
            ? "alive"
            : objects_2.nodeStatusToStatusState(node.status));
        await objects_2.setNodeReady(node.id, true);
        const allValueIDs = node.getDefinedValueIDs();
        await this.extendNodeObjectsAndStates(node, allValueIDs);
        // The controller node has no states and channels we need to clean up
        if (!node.isControllerNode()) {
            await this.cleanupNodeObjectsAndStates(node, allValueIDs);
        }
    }
    async extendNodeObjectsAndStates(node, allValueIDs) {
        // Make sure the device object exists and is up to date
        await objects_2.extendNode(node);
        // Skip channel and state creation for the controller node
        if (node.isControllerNode())
            return;
        // Collect all objects and states we have values for
        allValueIDs !== null && allValueIDs !== void 0 ? allValueIDs : (allValueIDs = node.getDefinedValueIDs());
        const uniqueCCs = allValueIDs
            .map((vid) => [vid.commandClass, vid.commandClassName])
            .filter(([cc], index, arr) => arr.findIndex(([_cc]) => _cc === cc) === index);
        // Make sure all channel objects are up to date
        for (const [cc, ccName] of uniqueCCs) {
            await objects_2.extendCC(node, cc, ccName);
        }
        // Sync the ioBroker states with the cached values. This must only happen if the interview is not complete yet
        // or the node started ready. Otherwise this would incorrectly mark all fresh values as stale
        if (node.interviewStage < zwave_js_1.InterviewStage.Complete ||
            (node.interviewStage === zwave_js_1.InterviewStage.Complete &&
                this.initialNodeInterviewStages.get(node.id) ===
                    zwave_js_1.InterviewStage.Complete)) {
            for (const valueId of allValueIDs) {
                const value = node.getValue(valueId);
                await objects_2.extendValue(node, Object.assign(Object.assign({}, valueId), { newValue: value }), 
                // The value is cached
                true);
            }
        }
    }
    async cleanupNodeObjectsAndStates(node, allValueIDs) {
        // Find out which channels and states need to exist
        allValueIDs !== null && allValueIDs !== void 0 ? allValueIDs : (allValueIDs = node.getDefinedValueIDs());
        const uniqueCCs = allValueIDs
            .map((vid) => [vid.commandClass, vid.commandClassName])
            .filter(([cc], index, arr) => arr.findIndex(([_cc]) => _cc === cc) === index);
        const nodeAbsoluteId = `${this.namespace}.${shared_1.computeDeviceId(node.id)}`;
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
            .filter((id) => id.slice(nodeAbsoluteId.length + 1).includes("."))
            // and filter out those states that are for a notification event
            .filter((id) => { var _a, _b; return !((_b = (_a = this.oObjects[id]) === null || _a === void 0 ? void 0 : _a.native) === null || _b === void 0 ? void 0 : _b.notificationEvent); });
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
    }
    async ensureDeviceObject(node) {
        const nodeAbsoluteId = `${this.namespace}.${shared_1.computeDeviceId(node.id)}`;
        if (!this.readyNodes.has(node.id) &&
            !(nodeAbsoluteId in this.oObjects)) {
            await objects_2.extendNode(node);
        }
    }
    async onNodeInterviewFailed(node, args) {
        if (args.isFinal) {
            this.log.error(`Node ${node.id} interview failed: ${args.errorMessage}`);
        }
        else {
            this.log.warn(`Node ${node.id} interview failed: ${args.errorMessage}`);
        }
    }
    async onNodeInterviewCompleted(node) {
        this.log.info(`Node ${node.id} interview completed`);
    }
    async onNodeWakeUp(node, oldStatus) {
        await objects_2.setNodeStatus(node.id, "awake");
        this.log.info(`Node ${node.id} is ${oldStatus === zwave_js_1.NodeStatus.Unknown ? "" : "now "}awake`);
    }
    async onNodeSleep(node, oldStatus) {
        await objects_2.setNodeStatus(node.id, "asleep");
        this.log.info(`Node ${node.id} is ${oldStatus === zwave_js_1.NodeStatus.Unknown ? "" : "now "}asleep`);
        // ensure we have a device object or users cannot remove failed nodes from the network
        await this.ensureDeviceObject(node);
    }
    async onNodeAlive(node, oldStatus) {
        await objects_2.setNodeStatus(node.id, "alive");
        if (oldStatus === zwave_js_1.NodeStatus.Dead) {
            this.log.info(`Node ${node.id}: has returned from the dead`);
        }
        else {
            this.log.info(`Node ${node.id} is alive`);
        }
    }
    async onNodeDead(node, oldStatus) {
        await objects_2.setNodeStatus(node.id, "dead");
        this.log.info(`Node ${node.id} is ${oldStatus === zwave_js_1.NodeStatus.Unknown ? "" : "now "}dead`);
        // ensure we have a device object or users cannot remove failed nodes from the network
        await this.ensureDeviceObject(node);
    }
    async onNodeValueAdded(node, args) {
        let propertyName = objects_2.computeId(node.id, args);
        propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
        this.log.debug(`Node ${node.id}: value added: ${propertyName} => ${String(args.newValue)}`);
        await objects_2.extendValue(node, args);
        if (this.config.switchCompat)
            await this.syncSwitchStates(node, args);
    }
    async onNodeValueUpdated(node, args) {
        let propertyName = objects_2.computeId(node.id, args);
        propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
        this.log.debug(`Node ${node.id}: value updated: ${propertyName} => ${String(args.newValue)}`);
        await objects_2.extendValue(node, args);
        if (this.config.switchCompat)
            await this.syncSwitchStates(node, args);
    }
    async onNodeValueNotification(node, args) {
        let propertyName = objects_2.computeId(node.id, args);
        propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
        this.log.debug(`Node ${node.id}: value notification: ${propertyName} = ${String(args.value)}`);
        await objects_2.extendNotificationValue(node, args);
    }
    /** Overwrites `targetValue` states with `currentValue` */
    async syncSwitchStates(node, args) {
        if ((args.commandClass === core_1.CommandClasses["Binary Switch"] ||
            args.commandClass === core_1.CommandClasses["Multilevel Switch"]) &&
            args.property === "currentValue") {
            await objects_2.extendValue(node, Object.assign(Object.assign({}, args), { property: "targetValue", propertyName: "targetValue" }));
        }
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
    async onNodeFirmwareUpdateProgress(node, sentFragments, totalFragments) {
        this.respondToFirmwareUpdatePoll({
            type: "progress",
            sentFragments,
            totalFragments,
        });
    }
    async onNodeFirmwareUpdateFinished(node, status, waitTime) {
        this.respondToFirmwareUpdatePoll({
            type: "done",
            status,
            waitTime,
        });
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
        let level = "error";
        // Treat non-critical errors as warnings
        if (error instanceof zwave_js_1.ZWaveError &&
            error.code === zwave_js_1.ZWaveErrorCodes.Controller_NodeInsecureCommunication) {
            level = "warn";
        }
        this.log[level](error.message);
        if (error instanceof zwave_js_1.ZWaveError &&
            error.code === zwave_js_1.ZWaveErrorCodes.Driver_Failed) {
            // This should not happen too regularly, so ask JS-Controller to restart the adapter
            this.log.error(`Restarting the adapter in a second...`);
            setTimeout(() => {
                this.terminate(utils.EXIT_CODES.START_IMMEDIATELY_AFTER_STOP);
            }, 1000);
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
                        await this.setInclusionMode(shared_1.InclusionMode.Idle);
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
                // Some CCs accept Buffers. In order to edit them in ioBroker, we support parsing strings like "0xbada55" as Buffers.
                let newValue = state.val;
                if (typeof newValue === "string" && shared_1.isBufferAsHex(newValue)) {
                    newValue = shared_1.bufferFromHex(newValue);
                }
                try {
                    await node.setValue(valueId, newValue);
                    // Don't use newValue to update ioBroker states, these are only for zwave-js
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
    async setInclusionMode(mode) {
        try {
            if (mode !== shared_1.InclusionMode.Idle) {
                await this.driver.controller.beginInclusion(mode === shared_1.InclusionMode.NonSecure);
            }
            else {
                await this.driver.controller.stopInclusion();
            }
        }
        catch (e) {
            /* nothing to do */
            this.log.error(e.message);
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
            this.log.error(e.message);
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
    /** Responds to a pending poll from the frontend (if there is a message outstanding) */
    respondToFirmwareUpdatePoll(response) {
        if (typeof this.firmwareUpdatePollCallback === "function") {
            // If the client is waiting for a response, send it immediately
            this.firmwareUpdatePollCallback(response);
            this.firmwareUpdatePollCallback = undefined;
        }
        else {
            // otherwise remember the response for the next call
            this.firmwareUpdatePollResponse = response;
        }
    }
    /**
     * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
     * Using this method requires "common.message" property to be set to true in io-package.json
     */
    async onMessage(obj) {
        // responds to the adapter that sent the original message
        const respond = (response) => {
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
                    const ports = await serialPorts_1.enumerateSerialPorts(this);
                    respond(responses.RESULT(ports));
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
                case "refreshNodeInfo": {
                    if (!this.driverReady) {
                        return respond(responses.ERROR("The driver is not yet ready to do that!"));
                    }
                    if (!requireParams("nodeId"))
                        return;
                    const { nodeId } = obj.message;
                    try {
                        await this.driver.controller.nodes
                            .get(nodeId)
                            .refreshInfo();
                        this.readyNodes.delete(nodeId);
                        this.log.info(`Node ${nodeId}: interview restarted`);
                    }
                    catch (e) {
                        return respond(responses.ERROR(`Could not refresh info for node ${nodeId}: ${e.message}`));
                    }
                    return respond(responses.OK);
                }
                case "beginFirmwareUpdate": {
                    if (!this.driverReady) {
                        return respond(responses.ERROR("The driver is not yet ready to do that!"));
                    }
                    if (!requireParams("nodeId", "filename", "firmware"))
                        return;
                    const { nodeId, filename, firmware } = obj.message;
                    if (typeguards_1.isArray(firmware) &&
                        firmware.every((byte) => typeof byte === "number")) {
                        // Extract the firmware from the uploaded file
                        const rawData = Buffer.from(firmware);
                        let actualFirmware;
                        try {
                            const format = firmwareUpdate_1.guessFirmwareFormat(filename, rawData);
                            actualFirmware = zwave_js_1.extractFirmware(rawData, format);
                        }
                        catch (e) {
                            return respond(responses.ERROR(e.message));
                        }
                        // And try to start the update
                        try {
                            await this.driver.controller.nodes
                                .get(nodeId)
                                .beginFirmwareUpdate(actualFirmware.data, actualFirmware.firmwareTarget);
                            this.log.info(`Node ${nodeId}: Firmware update started`);
                            return respond(responses.OK);
                        }
                        catch (e) {
                            if (e instanceof zwave_js_1.ZWaveError &&
                                e.code === zwave_js_1.ZWaveErrorCodes.FirmwareUpdateCC_Busy) {
                                return respond(responses.COMMAND_ACTIVE);
                            }
                            else {
                                return respond(responses.ERROR(e.message));
                            }
                        }
                    }
                    else {
                        return respond(responses.ERROR("The firmware data is invalid!"));
                    }
                }
                case "firmwareUpdatePoll": {
                    if (this.firmwareUpdatePollResponse) {
                        // if a response is waiting to be asked for, send it immediately
                        respond(responses.RESULT(this.firmwareUpdatePollResponse));
                        this.firmwareUpdatePollResponse = undefined;
                    }
                    else {
                        // otherwise remember the callback for a later response
                        this.respondToFirmwareUpdatePoll = (result) => respond(responses.RESULT(result));
                    }
                    return;
                }
                case "abortFirmwareUpdate": {
                    if (!this.driverReady) {
                        return respond(responses.ERROR("The driver is not yet ready to do that!"));
                    }
                    if (!requireParams("nodeId"))
                        return;
                    const { nodeId } = obj.message;
                    try {
                        await this.driver.controller.nodes
                            .get(nodeId)
                            .abortFirmwareUpdate();
                        this.log.info(`Node ${nodeId}: Firmware update aborted`);
                        return respond(responses.OK);
                    }
                    catch (e) {
                        return respond(responses.ERROR(e.message));
                    }
                }
                case "sendCommand": {
                    if (!this.driverReady) {
                        return respond(responses.ERROR("The driver is not yet ready to do that!"));
                    }
                    // Check that we got the params we need
                    if (!requireParams("nodeId", "commandClass", "command"))
                        return;
                    const { nodeId, endpoint: endpointIndex, commandClass, command, args, } = obj.message;
                    if (typeof nodeId !== "number") {
                        return respond(responses.ERROR(`nodeId must be a number`));
                    }
                    if (endpointIndex != undefined) {
                        if (typeof endpointIndex !== "number") {
                            return respond(responses.ERROR(`If an endpoint is given, it must be a number!`));
                        }
                        else if (endpointIndex < 0) {
                            return respond(responses.ERROR(`The endpoint must not be negative!`));
                        }
                    }
                    if (typeof commandClass !== "string" &&
                        typeof commandClass !== "number") {
                        return respond(responses.ERROR(`commandClass must be a string or number`));
                    }
                    else if (typeof command !== "string") {
                        return respond(responses.ERROR(`command must be a string`));
                    }
                    if (args != undefined && !typeguards_1.isArray(args)) {
                        return respond(responses.ERROR(`if args is given, it must be an array`));
                    }
                    const node = this.driver.controller.nodes.get(nodeId);
                    if (!node) {
                        return respond(responses.ERROR(`Node ${nodeId} was not found!`));
                    }
                    const endpoint = node.getEndpoint(endpointIndex !== null && endpointIndex !== void 0 ? endpointIndex : 0);
                    if (!endpoint) {
                        return respond(responses.ERROR(`Endpoint ${endpointIndex} does not exist on Node ${nodeId}!`));
                    }
                    let api;
                    try {
                        api = endpoint.commandClasses[commandClass];
                    }
                    catch (e) {
                        return respond(responses.ERROR(e.message));
                    }
                    if (!api.isSupported()) {
                        return respond(responses.ERROR(`Node ${nodeId} (Endpoint ${endpointIndex}) does not support CC ${commandClass}`));
                    }
                    else if (!(command in api)) {
                        return respond(responses.ERROR(`The command ${command} does not exist for CC ${commandClass}`));
                    }
                    try {
                        const method = api[command].bind(api);
                        const result = args
                            ? await method(...args)
                            : await method();
                        return respond(responses.RESULT(result));
                    }
                    catch (e) {
                        return respond(responses.ERROR(e.message));
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