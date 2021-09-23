var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};
__markAsModule(exports);
__export(exports, {
  ZWave2: () => ZWave2
});
var import_adapter_core = __toModule(require("@iobroker/adapter-core"));
var import_core = __toModule(require("@zwave-js/core"));
var import_log_transport_json = __toModule(require("@zwave-js/log-transport-json"));
var import_shared = __toModule(require("@zwave-js/shared"));
var import_deferred_promise = __toModule(require("alcalzone-shared/deferred-promise"));
var import_objects = __toModule(require("alcalzone-shared/objects"));
var import_typeguards = __toModule(require("alcalzone-shared/typeguards"));
var import_fs_extra = __toModule(require("fs-extra"));
var import_path = __toModule(require("path"));
var import_zwave_js = __toModule(require("zwave-js"));
var import_Controller = __toModule(require("zwave-js/Controller"));
var import_Utils = __toModule(require("zwave-js/Utils"));
var import_global = __toModule(require("./lib/global"));
var import_objects2 = __toModule(require("./lib/objects"));
var import_serialPorts = __toModule(require("./lib/serialPorts"));
var import_shared2 = __toModule(require("./lib/shared"));
var import_zwave = __toModule(require("./lib/zwave"));
class ZWave2 extends import_adapter_core.default.Adapter {
  constructor(options = {}) {
    super(__spreadProps(__spreadValues({}, options), {
      name: "zwave2",
      objects: true
    }));
    this.driverReady = false;
    this.readyNodes = new Set();
    this.virtualNodesUpdated = false;
    this.initialNodeInterviewStages = new Map();
    this.onNodeNotification = async (...params) => {
      if (params[1] === import_core.CommandClasses.Notification) {
        const [node, , args] = params;
        this.log.debug(`Node ${node.id}: received notification: ${args.label} - ${args.eventLabel}`);
        await (0, import_objects2.extendNotification_NotificationCC)(node, args);
      }
    };
    this.pushPayloads = [];
    this.pushCallbacks = new Map();
    this.pushToFrontendBusy = false;
    this.on("ready", this.onReady.bind(this));
    this.on("objectChange", this.onObjectChange.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    import_global.Global.adapter = this;
    const cacheDir = import_path.default.join(import_adapter_core.default.getAbsoluteInstanceDataDir(this), "cache");
    if (!!this.config.clearCache) {
      await import_fs_extra.default.remove(cacheDir);
      this.updateConfig({clearCache: false});
      return;
    }
    await this.subscribeStatesAsync("*");
    this.setState("info.connection", false, true);
    this.setState(`info.inclusion`, false, true);
    this.setState(`info.exclusion`, false, true);
    this.setState("info.healingNetwork", false, true);
    if (!this.config.serialport) {
      this.log.warn("No serial port configured. Please select one in the adapter settings!");
      return;
    }
    const timeouts = this.config.driver_increaseTimeouts ? {
      ack: 2e3,
      response: 3e3
    } : void 0;
    const attempts = this.config.driver_increaseSendAttempts ? {
      sendData: 5
    } : void 0;
    const securityKeys = {};
    const S0_Legacy = this.config.networkKey || this.config.networkKey_S0;
    if (typeof S0_Legacy === "string" && S0_Legacy.length === 32) {
      securityKeys.S0_Legacy = Buffer.from(S0_Legacy, "hex");
    }
    for (const secClass of [
      "S2_AccessControl",
      "S2_Authenticated",
      "S2_Unauthenticated"
    ]) {
      const key = this.config[`networkKey_${secClass}`];
      if (typeof key === "string" && key.length === 32) {
        securityKeys[secClass] = Buffer.from(key, "hex");
      }
    }
    this.driver = new import_zwave_js.Driver(this.config.serialport, {
      timeouts,
      attempts,
      logConfig: {
        logToFile: !!this.config.writeLogFile
      },
      storage: {
        cacheDir
      },
      securityKeys,
      interview: {
        queryAllUserCodes: true
      }
    });
    this.driver.once("driver ready", async () => {
      this.driverReady = true;
      this.setState("info.connection", true, true);
      this.log.info(`The driver is ready. Found ${this.driver.controller.nodes.size} nodes.`);
      this.driver.controller.on("inclusion started", this.onInclusionStarted.bind(this)).on("exclusion started", this.onExclusionStarted.bind(this)).on("inclusion stopped", this.onInclusionStopped.bind(this)).on("exclusion stopped", this.onExclusionStopped.bind(this)).on("inclusion failed", this.onInclusionFailed.bind(this)).on("exclusion failed", this.onExclusionFailed.bind(this)).on("node added", this.onNodeAdded.bind(this)).on("node removed", this.onNodeRemoved.bind(this)).on("heal network progress", this.onHealNetworkProgress.bind(this)).on("heal network done", this.onHealNetworkDone.bind(this));
      await this.setStateAsync("info.configVersion", this.driver.configVersion, true);
      await this.setStateAsync("info.configUpdate", null, true);
      void this.checkForConfigUpdates();
      try {
        const rfRegion = await this.driver.controller.getRFRegion();
        await (0, import_objects2.setRFRegionState)(rfRegion);
      } catch {
        await (0, import_objects2.setRFRegionState)(void 0);
      }
      this.initialNodeInterviewStages = new Map([...this.driver.controller.nodes.values()].map((node) => [
        node.id,
        node.interviewStage
      ]));
      for (const [nodeId, node] of this.driver.controller.nodes) {
        await (0, import_objects2.setNodeStatus)(nodeId, (0, import_objects2.nodeStatusToStatusState)(node.status));
        await (0, import_objects2.setNodeReady)(nodeId, node.ready);
        this.addNodeEventHandlers(node);
        if (node.ready) {
          void this.onNodeReady(node);
        } else {
          await this.extendNodeObjectsAndStates(node);
        }
      }
      const nodeIdRegex = new RegExp(`^${this.name}\\.${this.instance}\\.Node_(\\d+)`);
      const existingNodeIds = Object.keys(await import_global.Global.$$(`${this.namespace}.*`, {type: "device"})).map((id) => {
        var _a;
        return (_a = id.match(nodeIdRegex)) == null ? void 0 : _a[1];
      }).filter((id) => !!id).map((id) => parseInt(id, 10)).filter((id, index, all) => all.indexOf(id) === index);
      const unusedNodeIds = existingNodeIds.filter((id) => !this.driver.controller.nodes.has(id));
      for (const nodeId of unusedNodeIds) {
        this.log.warn(`Deleting orphaned node ${nodeId}`);
        await (0, import_objects2.removeNode)(nodeId);
      }
    });
    this.driver.on("error", this.onZWaveError.bind(this));
    this.driver.once("all nodes ready", async () => {
      this.log.info("All nodes are ready to use");
      await this.updateVirtualNodes();
    });
    try {
      this.driver.enableStatistics({
        applicationName: "ioBroker.zwave2",
        applicationVersion: require("iobroker.zwave2/package.json").version
      });
    } catch {
    }
    try {
      await this.driver.start();
    } catch (e) {
      this.log.error(`The Z-Wave driver could not be started: ${(0, import_shared2.getErrorMessage)(e)}`);
    }
  }
  async onInclusionStarted(_secure, strategy) {
    this.log.info(`inclusion started (strategy: ${import_Controller.InclusionStrategy[strategy]})`);
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
  async onNodeAdded(node, result) {
    var _a;
    this.log.info(`Node ${node.id}: added`);
    this.virtualNodesUpdated = false;
    this.addNodeEventHandlers(node);
    this.pushToFrontend({
      type: "inclusion",
      status: {
        type: "done",
        nodeId: node.id,
        lowSecurity: !!result.lowSecurity,
        securityClass: import_core.SecurityClass[(_a = node.getHighestSecurityClass()) != null ? _a : import_core.SecurityClass.None]
      }
    });
  }
  async onNodeRemoved(node, replaced) {
    if (replaced) {
      this.log.info(`Node ${node.id}: replace started`);
      this.readyNodes.delete(node.id);
    } else {
      this.log.info(`Node ${node.id}: removed`);
      this.pushToFrontend({
        type: "inclusion",
        status: {
          type: "exclusionDone",
          nodeId: node.id
        }
      });
    }
    node.removeAllListeners();
    await (0, import_objects2.removeNode)(node.id);
    this.virtualNodesUpdated = false;
    await this.updateVirtualNodes();
  }
  async onHealNetworkProgress(progress) {
    const allDone = [...progress.values()].every((v) => v !== "pending");
    if (allDone)
      return;
    this.pushToFrontend({
      type: "healing",
      status: {
        type: "progress",
        progress: (0, import_shared2.mapToRecord)(progress)
      }
    });
  }
  async onHealNetworkDone(result) {
    this.pushToFrontend({
      type: "healing",
      status: {
        type: "done",
        progress: (0, import_shared2.mapToRecord)(result)
      }
    });
    this.setState("info.healingNetwork", false, true);
  }
  addNodeEventHandlers(node) {
    node.on("ready", this.onNodeReady.bind(this)).on("interview failed", this.onNodeInterviewFailed.bind(this)).on("interview completed", this.onNodeInterviewCompleted.bind(this)).on("wake up", this.onNodeWakeUp.bind(this)).on("sleep", this.onNodeSleep.bind(this)).on("alive", this.onNodeAlive.bind(this)).on("dead", this.onNodeDead.bind(this)).on("value added", this.onNodeValueAdded.bind(this)).on("value updated", this.onNodeValueUpdated.bind(this)).on("value removed", this.onNodeValueRemoved.bind(this)).on("value notification", this.onNodeValueNotification.bind(this)).on("metadata updated", this.onNodeMetadataUpdated.bind(this)).on("firmware update progress", this.onNodeFirmwareUpdateProgress.bind(this)).on("firmware update finished", this.onNodeFirmwareUpdateFinished.bind(this)).on("notification", this.onNodeNotification.bind(this));
  }
  async onNodeReady(node) {
    if (this.readyNodes.has(node.id))
      return;
    this.readyNodes.add(node.id);
    this.log.info(`Node ${node.id}: ready to use`);
    await (0, import_objects2.setNodeStatus)(node.id, node.id === this.driver.controller.ownNodeId ? "alive" : (0, import_objects2.nodeStatusToStatusState)(node.status));
    await (0, import_objects2.setNodeReady)(node.id, true);
    const allValueIDs = node.getDefinedValueIDs();
    await this.extendNodeObjectsAndStates(node, allValueIDs);
    if (!node.isControllerNode()) {
      await this.cleanupNodeObjectsAndStates(node, allValueIDs);
    }
    await this.updateVirtualNodes();
  }
  async updateVirtualNodes() {
    if (this.virtualNodesUpdated)
      return;
    this.virtualNodesUpdated = true;
    this.log.info(`Updating broadcast/multicast node states`);
    let node = this.driver.controller.getBroadcastNode();
    const allValueIDs = (0, import_zwave.getVirtualValueIDs)(node);
    await (0, import_objects2.ensureBroadcastNode)();
    await this.extendVirtualNodeObjectsAndStates(node, import_objects2.DEVICE_ID_BROADCAST, allValueIDs);
    await this.cleanupVirtualNodeObjects(import_objects2.DEVICE_ID_BROADCAST, allValueIDs);
    const multicastNodes = await this.getMulticastNodeDefinitions();
    for (const {objId, nodeIds} of multicastNodes) {
      node = this.driver.controller.getMulticastGroup(nodeIds);
      const deviceId = objId.substr(this.namespace.length + 1);
      const allValueIDs2 = (0, import_zwave.getVirtualValueIDs)(node);
      await this.extendVirtualNodeObjectsAndStates(node, deviceId, allValueIDs2);
      await this.cleanupVirtualNodeObjects(deviceId, allValueIDs2);
    }
    await this.cleanupOrphanedMulticastNodeTrees(multicastNodes.map((n) => n.objId));
  }
  async getMulticastNodeDefinitions() {
    const devices = (await this.getObjectViewAsync("system", "device", {
      startkey: `${this.namespace}.Group_`,
      endkey: `${this.namespace}.Group_\u9999`
    })).rows.map((r) => r.value).filter((o) => !!o);
    const ret = [];
    for (const d of devices) {
      if (!d.native.multicast)
        continue;
      if (!(0, import_typeguards.isArray)(d.native.nodeIds) || !d.native.nodeIds.length) {
        continue;
      }
      if (!d.native.nodeIds.every((n) => typeof n === "number" && n > 0 && n <= import_core.MAX_NODES)) {
        this.log.warn(`Multicast group object ${d._id} contains invalid node IDs, ignoring it!`);
        continue;
      }
      ret.push({objId: d._id, nodeIds: d.native.nodeIds});
    }
    return ret;
  }
  async cleanupOrphanedMulticastNodeTrees(multicastGroupIds) {
    const objectIds = [
      ...(await this.getObjectViewAsync("system", "channel", {
        startkey: `${this.namespace}.Group_`,
        endkey: `${this.namespace}.Group_\u9999`
      })).rows.map((r) => r.value),
      ...(await this.getObjectViewAsync("system", "state", {
        startkey: `${this.namespace}.Group_`,
        endkey: `${this.namespace}.Group_\u9999`
      })).rows.map((r) => r.value)
    ].filter((o) => !!o).map((o) => o._id);
    const orphanedIds = objectIds.filter((oid) => !multicastGroupIds.some((gid) => oid.startsWith(gid + ".")));
    for (const id of orphanedIds) {
      this.log.debug(`Deleting orphaned multicast object ${id}`);
      try {
        await this.delObjectAsync(id);
      } catch (e) {
      }
    }
  }
  async extendNodeObjectsAndStates(node, allValueIDs) {
    await (0, import_objects2.extendNode)(node);
    if (node.isControllerNode())
      return;
    allValueIDs != null ? allValueIDs : allValueIDs = node.getDefinedValueIDs();
    const uniqueCCs = allValueIDs.map((vid) => [vid.commandClass, vid.commandClassName]).filter(([cc], index, arr) => arr.findIndex(([_cc]) => _cc === cc) === index);
    for (const [cc, ccName] of uniqueCCs) {
      await (0, import_objects2.extendCC)(node, cc, ccName);
    }
    if (node.interviewStage < import_zwave_js.InterviewStage.Complete || node.interviewStage === import_zwave_js.InterviewStage.Complete && this.initialNodeInterviewStages.get(node.id) === import_zwave_js.InterviewStage.Complete) {
      for (const valueId of allValueIDs) {
        const value = node.getValue(valueId);
        await (0, import_objects2.extendValue)(node, __spreadProps(__spreadValues({}, valueId), {
          newValue: value
        }), true);
      }
    }
  }
  async extendVirtualNodeObjectsAndStates(node, deviceId, valueIDs) {
    const uniqueCCs = valueIDs.map((vid) => [vid.commandClass, vid.commandClassName]).filter(([cc], index, arr) => arr.findIndex(([_cc]) => _cc === cc) === index);
    for (const [cc, ccName] of uniqueCCs) {
      await (0, import_objects2.extendVirtualNodeCC)(node, deviceId, cc, ccName);
    }
    for (const valueId of valueIDs) {
      await (0, import_objects2.extendVirtualMetadata)(node, deviceId, valueId);
    }
  }
  async cleanupNodeObjectsAndStates(node, allValueIDs) {
    allValueIDs != null ? allValueIDs : allValueIDs = node.getDefinedValueIDs();
    const uniqueCCs = allValueIDs.map((vid) => [vid.commandClass, vid.commandClassName]).filter(([cc], index, arr) => arr.findIndex(([_cc]) => _cc === cc) === index);
    const nodeAbsoluteId = `${this.namespace}.${(0, import_shared2.computeDeviceId)(node.id)}`;
    const desiredChannelIds = new Set(uniqueCCs.map(([, ccName]) => `${this.namespace}.${(0, import_objects2.computeChannelId)(node.id, ccName)}`));
    const existingChannelIds = Object.keys(await import_global.Global.$$(`${nodeAbsoluteId}.*`, {
      type: "channel"
    }));
    const desiredStateIds = new Set(allValueIDs.map((vid) => `${this.namespace}.${(0, import_objects2.computeStateId)(node.id, vid)}`));
    const existingStateIds = Object.keys(await import_global.Global.$$(`${nodeAbsoluteId}.*`, {
      type: "state"
    }));
    const unusedChannels = existingChannelIds.filter((id) => !desiredChannelIds.has(id));
    for (const id of unusedChannels) {
      this.log.warn(`Deleting orphaned channel ${id}`);
      try {
        await this.delObjectAsync(id);
      } catch (e) {
      }
    }
    const unusedStates = existingStateIds.filter((id) => !desiredStateIds.has(id)).filter((id) => id.slice(nodeAbsoluteId.length + 1).includes(".")).filter((id) => {
      var _a, _b;
      return !((_b = (_a = this.oObjects[id]) == null ? void 0 : _a.native) == null ? void 0 : _b.notificationEvent);
    });
    for (const id of unusedStates) {
      this.log.warn(`Deleting orphaned state ${id}`);
      try {
        await this.delStateAsync(id);
      } catch (e) {
      }
      try {
        await this.delObjectAsync(id);
      } catch (e) {
      }
    }
  }
  async cleanupVirtualNodeObjects(deviceId, valueIDs) {
    const uniqueCCs = valueIDs.map((vid) => [vid.commandClass, vid.commandClassName]).filter(([cc], index, arr) => arr.findIndex(([_cc]) => _cc === cc) === index);
    const nodeAbsoluteId = `${this.namespace}.${deviceId}`;
    const desiredChannelIds = new Set(uniqueCCs.map(([, ccName]) => `${this.namespace}.${(0, import_objects2.computeVirtualChannelId)(deviceId, ccName)}`));
    const existingChannelIds = Object.keys(await import_global.Global.$$(`${nodeAbsoluteId}.*`, {
      type: "channel"
    }));
    const desiredStateIds = new Set(valueIDs.map((vid) => `${this.namespace}.${(0, import_objects2.computeVirtualStateId)(deviceId, vid)}`));
    const existingStateIds = Object.keys(await import_global.Global.$$(`${nodeAbsoluteId}.*`, {
      type: "state"
    }));
    const unusedChannels = existingChannelIds.filter((id) => !desiredChannelIds.has(id));
    for (const id of unusedChannels) {
      this.log.warn(`Deleting orphaned channel ${id}`);
      try {
        await this.delObjectAsync(id);
      } catch (e) {
      }
    }
    const unusedStates = existingStateIds.filter((id) => !desiredStateIds.has(id)).filter((id) => id.slice(nodeAbsoluteId.length + 1).includes(".")).filter((id) => {
      var _a, _b;
      return !((_b = (_a = this.oObjects[id]) == null ? void 0 : _a.native) == null ? void 0 : _b.notificationEvent);
    });
    for (const id of unusedStates) {
      this.log.warn(`Deleting orphaned virtual state ${id}`);
      try {
        await this.delObjectAsync(id);
      } catch (e) {
      }
    }
  }
  async ensureDeviceObject(node) {
    const nodeAbsoluteId = `${this.namespace}.${(0, import_shared2.computeDeviceId)(node.id)}`;
    if (!this.readyNodes.has(node.id) && !(nodeAbsoluteId in this.oObjects)) {
      await (0, import_objects2.extendNode)(node);
    }
  }
  async onNodeInterviewFailed(node, args) {
    if (args.isFinal) {
      this.log.error(`Node ${node.id} interview failed: ${args.errorMessage}`);
    } else {
      this.log.warn(`Node ${node.id} interview failed: ${args.errorMessage}`);
    }
  }
  async onNodeInterviewCompleted(node) {
    this.log.info(`Node ${node.id} interview completed`);
  }
  async onNodeWakeUp(node, oldStatus) {
    await (0, import_objects2.setNodeStatus)(node.id, "awake");
    this.log.info(`Node ${node.id} is ${oldStatus === import_zwave_js.NodeStatus.Unknown ? "" : "now "}awake`);
  }
  async onNodeSleep(node, oldStatus) {
    await (0, import_objects2.setNodeStatus)(node.id, "asleep");
    this.log.info(`Node ${node.id} is ${oldStatus === import_zwave_js.NodeStatus.Unknown ? "" : "now "}asleep`);
    await this.ensureDeviceObject(node);
  }
  async onNodeAlive(node, oldStatus) {
    await (0, import_objects2.setNodeStatus)(node.id, "alive");
    if (oldStatus === import_zwave_js.NodeStatus.Dead) {
      this.log.info(`Node ${node.id}: has returned from the dead`);
    } else {
      this.log.info(`Node ${node.id} is alive`);
    }
  }
  async onNodeDead(node, oldStatus) {
    await (0, import_objects2.setNodeStatus)(node.id, "dead");
    this.log.info(`Node ${node.id} is ${oldStatus === import_zwave_js.NodeStatus.Unknown ? "" : "now "}dead`);
    await this.ensureDeviceObject(node);
  }
  async onNodeValueAdded(node, args) {
    let propertyName = (0, import_objects2.computeStateId)(node.id, args);
    propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
    this.log.debug(`Node ${node.id}: value added: ${propertyName} => ${String(args.newValue)}`);
    await (0, import_objects2.extendValue)(node, args);
    if (this.config.switchCompat)
      await this.syncSwitchStates(node, args);
  }
  async onNodeValueUpdated(node, args) {
    let propertyName = (0, import_objects2.computeStateId)(node.id, args);
    propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
    this.log.debug(`Node ${node.id}: value updated: ${propertyName} => ${String(args.newValue)}`);
    await (0, import_objects2.extendValue)(node, args);
    if (this.config.switchCompat)
      await this.syncSwitchStates(node, args);
  }
  async onNodeValueNotification(node, args) {
    let propertyName = (0, import_objects2.computeStateId)(node.id, args);
    propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
    this.log.debug(`Node ${node.id}: value notification: ${propertyName} = ${String(args.value)}`);
    await (0, import_objects2.extendNotificationValue)(node, args);
  }
  async syncSwitchStates(node, args) {
    if ((args.commandClass === import_core.CommandClasses["Binary Switch"] || args.commandClass === import_core.CommandClasses["Multilevel Switch"]) && args.property === "currentValue") {
      await (0, import_objects2.extendValue)(node, __spreadProps(__spreadValues({}, args), {
        property: "targetValue",
        propertyName: "targetValue"
      }));
    }
  }
  async onNodeValueRemoved(node, args) {
    let propertyName = (0, import_objects2.computeStateId)(node.id, args);
    propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
    this.log.debug(`Node ${node.id}: value removed: ${propertyName}`);
    await (0, import_objects2.removeValue)(node.id, args);
  }
  async onNodeMetadataUpdated(node, args) {
    let propertyName = (0, import_objects2.computeStateId)(node.id, args);
    propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
    this.log.debug(`Node ${node.id}: metadata updated: ${propertyName}`);
    await (0, import_objects2.extendMetadata)(node, args);
  }
  async onNodeFirmwareUpdateProgress(node, sentFragments, totalFragments) {
    this.pushToFrontend({
      type: "firmwareUpdate",
      progress: {
        type: "progress",
        sentFragments,
        totalFragments
      }
    });
  }
  async onNodeFirmwareUpdateFinished(node, status, waitTime) {
    this.pushToFrontend({
      type: "firmwareUpdate",
      progress: {
        type: "done",
        status,
        waitTime
      }
    });
  }
  async checkForConfigUpdates() {
    var _a, _b;
    if (!((_a = await this.getStateAsync("info.configUpdate")) == null ? void 0 : _a.val)) {
      try {
        await this.setStateChangedAsync("info.configUpdate", (_b = await this.driver.checkForConfigUpdates()) != null ? _b : null, true);
      } catch (e) {
        await this.setStateChangedAsync("info.configUpdate", null, true);
        this.log.error(`Failed to check for config updates: ${(0, import_shared2.getErrorMessage)(e)}`);
      }
    }
    const hour = new Date().getUTCHours();
    let timeoutHours = 5 - hour;
    if (timeoutHours <= 0)
      timeoutHours += 24;
    this.configUpdateTimeout = setTimeout(() => this.checkForConfigUpdates(), timeoutHours * 3600 * 1e3);
  }
  async onUnload(callback) {
    try {
      this.log.info("Shutting down driver...");
      const allNodeIds = [...this.driver.controller.nodes.keys()];
      await this.driver.destroy();
      this.log.info("Resetting node status...");
      for (const nodeId of allNodeIds) {
        await (0, import_objects2.setNodeStatus)(nodeId, "unknown");
        await (0, import_objects2.setNodeReady)(nodeId, false);
      }
      if (this.configUpdateTimeout)
        clearTimeout(this.configUpdateTimeout);
      if (this.pushPayloadExpirationTimeout)
        clearTimeout(this.pushPayloadExpirationTimeout);
      await this.setStateAsync("info.configUpdating", false, true);
      this.log.info("Cleaned everything up!");
      callback();
    } catch (e) {
      callback();
    }
  }
  async onZWaveError(error) {
    let level = "error";
    if (error instanceof import_zwave_js.ZWaveError && error.code === import_zwave_js.ZWaveErrorCodes.Controller_NodeInsecureCommunication) {
      level = "warn";
    }
    this.log[level](error.message);
    if (error instanceof import_zwave_js.ZWaveError && error.code === import_zwave_js.ZWaveErrorCodes.Driver_Failed) {
      this.log.error(`Restarting the adapter in a second...`);
      setTimeout(() => {
        this.terminate(import_adapter_core.default.EXIT_CODES.START_IMMEDIATELY_AFTER_STOP);
      }, 1e3);
    }
  }
  async onObjectChange(id, _obj) {
    const prefix = this.namespace + ".Group_";
    if (id.startsWith(prefix) && id.indexOf(".", prefix.length) === -1) {
      this.virtualNodesUpdated = false;
      await this.updateVirtualNodes();
    }
  }
  async onStateChange(id, state) {
    if (state) {
      if (!state.ack) {
        if (!this.driverReady) {
          this.log.warn(`The driver is not yet ready, ignoring state change for "${id}"`);
          return;
        }
        if (id.endsWith("info.exclusion")) {
          await this.setExclusionMode(state.val);
          return;
        } else if (id.startsWith(`${this.namespace}.info.`)) {
          return;
        }
        const obj = this.oObjects[id];
        if (!obj) {
          this.log.error(`Object definition for state ${id} is missing!`);
          return;
        }
        const {native} = obj;
        const valueId = native.valueId;
        if (!(valueId && valueId.commandClass && valueId.property)) {
          this.log.error(`Value ID missing or incomplete in object definition ${id}!`);
          return;
        }
        let node;
        if (!!native.broadcast) {
          node = this.driver.controller.getBroadcastNode();
        } else if ((0, import_typeguards.isArray)(native.nodeIds)) {
          node = this.driver.controller.getMulticastGroup(native.nodeIds);
        } else {
          const nodeId = native.nodeId;
          if (!nodeId) {
            this.log.error(`Node ID missing from object definition ${id}!`);
            return;
          }
          try {
            node = this.driver.controller.nodes.getOrThrow(nodeId);
          } catch {
            this.log.error(`Node ${nodeId} does not exist!`);
            return;
          }
        }
        let newValue = state.val;
        if (typeof newValue === "string" && (0, import_shared2.isBufferAsHex)(newValue)) {
          newValue = (0, import_shared2.bufferFromHex)(newValue);
        }
        try {
          await node.setValue(valueId, newValue);
          await this.setStateAsync(id, {val: state.val, ack: true});
        } catch (e) {
          this.log.error((0, import_shared2.getErrorMessage)(e));
        }
      }
    }
  }
  async setExclusionMode(active) {
    try {
      if (active) {
        await this.driver.controller.beginExclusion();
      } else {
        await this.driver.controller.stopExclusion();
      }
    } catch (e) {
      this.log.error((0, import_shared2.getErrorMessage)(e));
    }
  }
  pushToFrontend(payload) {
    this.pushPayloads.push(payload);
    if (this.pushToFrontendBusy)
      return;
    this.pushToFrontendBusy = true;
    if (this.pushCallbacks.size > 0) {
      const payloads = this.pushPayloads.splice(0, this.pushPayloads.length);
      this.pushCallbacks.forEach((cb) => cb(payloads));
      this.pushCallbacks.clear();
    } else {
      if (!this.pushPayloadExpirationTimeout) {
        this.pushPayloadExpirationTimeout = setTimeout(() => {
          console.warn("push timeout expired");
          this.pushPayloads.splice(0, this.pushPayloads.length);
        }, 2500);
      }
    }
    this.pushToFrontendBusy = false;
  }
  async onMessage(obj) {
    var _a, _b, _c;
    const respond = (response) => {
      if (obj.callback)
        this.sendTo(obj.from, obj.command, response, obj.callback);
    };
    const responses = {
      ACK: {error: null},
      OK: {error: null, result: "ok"},
      ERROR_UNKNOWN_COMMAND: {error: "Unknown command!"},
      MISSING_PARAMETER: (paramName) => {
        return {error: 'missing parameter "' + paramName + '"!'};
      },
      COMMAND_ACTIVE: {error: "command already active"},
      RESULT: (result) => ({error: null, result}),
      ERROR: (error) => ({error})
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
          const tasks = [
            ...this.driver.controller.nodes.values()
          ].map(async (node) => ({
            id: node.id,
            name: `Node ${node.id}`,
            neighbors: await this.driver.controller.getNodeNeighbors(node.id)
          }));
          const map = await Promise.all(tasks);
          respond(responses.RESULT(map));
          return;
        }
        case "getSerialPorts": {
          const ports = await (0, import_serialPorts.enumerateSerialPorts)(this);
          respond(responses.RESULT(ports));
          return;
        }
        case "registerPushCallback": {
          if (!requireParams("uuid"))
            return;
          const params = obj.message;
          const clearPending = !!params.clearPending;
          if (clearPending) {
            this.pushPayloads.splice(0, this.pushPayloads.length);
          }
          if (this.pushPayloads.length) {
            respond(responses.RESULT(this.pushPayloads));
            this.pushPayloads.splice(0, this.pushPayloads.length);
            if (this.pushPayloadExpirationTimeout)
              clearTimeout(this.pushPayloadExpirationTimeout);
          } else {
            this.pushCallbacks.set(params.uuid, (result) => respond(responses.RESULT(result)));
          }
          return;
        }
        case "beginInclusion": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to include devices!"));
          }
          if (!requireParams("strategy"))
            return;
          const params = obj.message;
          const strategy = params.strategy;
          const forceSecurity = !!params.forceSecurity;
          this.validateDSKPromise = void 0;
          this.grantSecurityClassesPromise = void 0;
          const userCallbacks = {
            validateDSKAndEnterPIN: (dsk) => {
              this.validateDSKPromise = (0, import_deferred_promise.createDeferredPromise)();
              this.pushToFrontend({
                type: "inclusion",
                status: {
                  type: "validateDSK",
                  dsk
                }
              });
              this.validateDSKPromise.then(() => {
                console.warn("validateDSKPromise resolved!");
                console.warn(new Error().stack);
              });
              return this.validateDSKPromise;
            },
            grantSecurityClasses: (grant) => {
              this.grantSecurityClassesPromise = (0, import_deferred_promise.createDeferredPromise)();
              this.pushToFrontend({
                type: "inclusion",
                status: {
                  type: "grantSecurityClasses",
                  request: grant
                }
              });
              this.grantSecurityClassesPromise.then(() => {
                console.warn("grantSecurityClassesPromise resolved!");
                console.warn(new Error().stack);
              });
              return this.grantSecurityClassesPromise;
            },
            abort: () => {
            }
          };
          try {
            const result = await this.driver.controller.beginInclusion({
              strategy,
              forceSecurity,
              userCallbacks
            });
            this.setState("info.inclusion", true, true);
            if (result) {
              respond(responses.OK);
            } else {
              respond(responses.COMMAND_ACTIVE);
            }
          } catch (e) {
            respond(responses.ERROR((0, import_shared2.getErrorMessage)(e)));
            this.setState("info.inclusion", false, true);
          }
          return;
        }
        case "validateDSK": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to include devices!"));
          }
          if (!requireParams("pin"))
            return;
          const params = obj.message;
          const pin = params.pin;
          console.warn("RESOLVE validateDSKPromise");
          if (!pin) {
            (_a = this.validateDSKPromise) == null ? void 0 : _a.resolve(false);
          } else {
            (_b = this.validateDSKPromise) == null ? void 0 : _b.resolve(pin);
          }
          this.pushToFrontend({
            type: "inclusion",
            status: {type: "busy"}
          });
          respond(responses.ACK);
          return;
        }
        case "grantSecurityClasses": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to include devices!"));
          }
          if (!requireParams("grant"))
            return;
          const params = obj.message;
          const grant = params.grant;
          console.warn("RESOLVE grantSecurityClassesPromise");
          (_c = this.grantSecurityClassesPromise) == null ? void 0 : _c.resolve(grant);
          this.pushToFrontend({
            type: "inclusion",
            status: {type: "busy"}
          });
          respond(responses.ACK);
          return;
        }
        case "stopInclusion": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to include devices!"));
          }
          const result = await this.driver.controller.stopInclusion();
          if (result) {
            respond(responses.OK);
            this.setState("info.inclusion", false, true);
          } else {
            respond(responses.COMMAND_ACTIVE);
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
          } else {
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
        case "hardReset": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready!"));
          }
          try {
            await this.driver.hardReset();
            respond(responses.OK);
            this.restart();
          } catch (e) {
            respond(responses.ERROR((0, import_shared2.getErrorMessage)(e)));
          }
          return;
        }
        case "clearCache": {
          this.updateConfig({clearCache: true});
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
          } catch (e) {
            return respond(responses.ERROR(`Could not remove node ${params.nodeId}: ${(0, import_shared2.getErrorMessage)(e)}`));
          }
          return respond(responses.OK);
        }
        case "replaceFailedNode": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to replace devices!"));
          }
          if (!requireParams("nodeId", "strategy"))
            return;
          const params = obj.message;
          const strategy = params.strategy;
          this.validateDSKPromise = void 0;
          this.grantSecurityClassesPromise = void 0;
          const userCallbacks = {
            validateDSKAndEnterPIN: (dsk) => {
              this.validateDSKPromise = (0, import_deferred_promise.createDeferredPromise)();
              this.pushToFrontend({
                type: "inclusion",
                status: {
                  type: "validateDSK",
                  dsk
                }
              });
              this.validateDSKPromise.then(() => {
                console.warn("validateDSKPromise resolved!");
                console.warn(new Error().stack);
              });
              return this.validateDSKPromise;
            },
            grantSecurityClasses: (grant) => {
              this.grantSecurityClassesPromise = (0, import_deferred_promise.createDeferredPromise)();
              this.pushToFrontend({
                type: "inclusion",
                status: {
                  type: "grantSecurityClasses",
                  request: grant
                }
              });
              this.grantSecurityClassesPromise.then(() => {
                console.warn("grantSecurityClassesPromise resolved!");
                console.warn(new Error().stack);
              });
              return this.grantSecurityClassesPromise;
            },
            abort: () => {
            }
          };
          try {
            const result = await this.driver.controller.replaceFailedNode(params.nodeId, {
              strategy,
              userCallbacks
            });
            this.setState("info.inclusion", true, true);
            if (result) {
              respond(responses.OK);
            } else {
              respond(responses.COMMAND_ACTIVE);
            }
          } catch (e) {
            respond(responses.ERROR((0, import_shared2.getErrorMessage)(e)));
            this.setState("info.inclusion", false, true);
          }
          return;
        }
        case "setRFRegion": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to do that!"));
          }
          if (!requireParams("region"))
            return;
          const params = obj.message;
          try {
            await this.driver.controller.setRFRegion(params.region);
            await (0, import_objects2.setRFRegionState)(params.region);
          } catch (e) {
            return respond(responses.ERROR(`Could not set region to ${(0, import_shared.getEnumMemberName)(import_Controller.RFRegion, params.region)}: ${(0, import_shared2.getErrorMessage)(e)}`));
          }
          return respond(responses.OK);
        }
        case "getEndpointIndizes": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to do that!"));
          }
          if (!requireParams("nodeId"))
            return;
          const params = obj.message;
          try {
            const node = this.driver.controller.nodes.getOrThrow(params.nodeId);
            const ret = node.getEndpointIndizes();
            return respond(responses.RESULT(ret));
          } catch (e) {
            return respond(responses.ERROR(`Could not get endpoint indizes for node ${params.nodeId}: ${(0, import_shared2.getErrorMessage)(e)}`));
          }
        }
        case "getAssociationGroups": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to do that!"));
          }
          if (!requireParams("source"))
            return;
          const params = obj.message;
          const source = params.source;
          try {
            const groups = this.driver.controller.getAssociationGroups(source);
            const ret = (0, import_objects.composeObject)([...groups]);
            return respond(responses.RESULT(ret));
          } catch (e) {
            return respond(responses.ERROR(`Could not get association groups for node ${params.nodeId}: ${(0, import_shared2.getErrorMessage)(e)}`));
          }
        }
        case "getAssociations": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to do that!"));
          }
          if (!requireParams("source"))
            return;
          const params = obj.message;
          const source = params.source;
          try {
            const assocs = this.driver.controller.getAssociations(source);
            const ret = (0, import_objects.composeObject)([...assocs]);
            return respond(responses.RESULT(ret));
          } catch (e) {
            return respond(responses.ERROR(`Could not get associations for node ${params.nodeId}: ${(0, import_shared2.getErrorMessage)(e)}`));
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
          const source = {
            nodeId,
            endpoint: definition.sourceEndpoint
          };
          const target = {
            nodeId: definition.nodeId,
            endpoint: definition.endpoint
          };
          try {
            await this.driver.controller.addAssociations(source, definition.group, [target]);
            return respond(responses.OK);
          } catch (e) {
            return respond(responses.ERROR(`Could not add association for node ${params.nodeId}: ${(0, import_shared2.getErrorMessage)(e)}`));
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
          const source = {
            nodeId,
            endpoint: definition.sourceEndpoint
          };
          const target = {
            nodeId: definition.nodeId,
            endpoint: definition.endpoint
          };
          try {
            await this.driver.controller.removeAssociations(source, definition.group, [target]);
            return respond(responses.OK);
          } catch (e) {
            return respond(responses.ERROR(`Could not remove association for node ${params.nodeId}: ${(0, import_shared2.getErrorMessage)(e)}`));
          }
        }
        case "refreshNodeInfo": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to do that!"));
          }
          if (!requireParams("nodeId"))
            return;
          const {nodeId} = obj.message;
          try {
            await this.driver.controller.nodes.get(nodeId).refreshInfo();
            this.readyNodes.delete(nodeId);
            this.log.info(`Node ${nodeId}: interview restarted`);
          } catch (e) {
            return respond(responses.ERROR(`Could not refresh info for node ${nodeId}: ${(0, import_shared2.getErrorMessage)(e)}`));
          }
          return respond(responses.OK);
        }
        case "beginFirmwareUpdate": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to do that!"));
          }
          if (!requireParams("nodeId", "filename", "firmware"))
            return;
          const {nodeId, filename, firmware} = obj.message;
          if ((0, import_typeguards.isArray)(firmware) && firmware.every((byte) => typeof byte === "number")) {
            const rawData = Buffer.from(firmware);
            let actualFirmware;
            try {
              const format = (0, import_Utils.guessFirmwareFileFormat)(filename, rawData);
              actualFirmware = (0, import_zwave_js.extractFirmware)(rawData, format);
            } catch (e) {
              return respond(responses.ERROR((0, import_shared2.getErrorMessage)(e)));
            }
            try {
              await this.driver.controller.nodes.get(nodeId).beginFirmwareUpdate(actualFirmware.data, actualFirmware.firmwareTarget);
              this.log.info(`Node ${nodeId}: Firmware update started`);
              return respond(responses.OK);
            } catch (e) {
              if (e instanceof import_zwave_js.ZWaveError && e.code === import_zwave_js.ZWaveErrorCodes.FirmwareUpdateCC_Busy) {
                return respond(responses.COMMAND_ACTIVE);
              } else {
                return respond(responses.ERROR((0, import_shared2.getErrorMessage)(e)));
              }
            }
          } else {
            return respond(responses.ERROR("The firmware data is invalid!"));
          }
        }
        case "abortFirmwareUpdate": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to do that!"));
          }
          if (!requireParams("nodeId"))
            return;
          const {nodeId} = obj.message;
          try {
            await this.driver.controller.nodes.get(nodeId).abortFirmwareUpdate();
            this.log.info(`Node ${nodeId}: Firmware update aborted`);
            return respond(responses.OK);
          } catch (e) {
            return respond(responses.ERROR((0, import_shared2.getErrorMessage)(e)));
          }
        }
        case "updateConfig": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to do that!"));
          }
          try {
            await this.setStateAsync("info.configUpdating", true, true);
            const result = await this.driver.installConfigUpdate();
            await this.setStateAsync("info.configUpdate", null, true);
            await this.setStateAsync("info.configVersion", this.driver.configVersion, true);
            return respond(responses.RESULT(result));
          } catch (e) {
            this.log.error(`Could not install config updates: ${(0, import_shared2.getErrorMessage)(e)}`);
            return respond(responses.ERROR(`Could not install config updates: ${(0, import_shared2.getErrorMessage)(e)}`));
          } finally {
            await this.setStateAsync("info.configUpdating", false, true);
          }
        }
        case "sendCommand": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to do that!"));
          }
          if (!requireParams("nodeId", "commandClass", "command"))
            return;
          const {
            nodeId,
            endpoint: endpointIndex,
            commandClass,
            command,
            args
          } = obj.message;
          if (typeof nodeId !== "number") {
            return respond(responses.ERROR(`nodeId must be a number`));
          }
          if (endpointIndex != void 0) {
            if (typeof endpointIndex !== "number") {
              return respond(responses.ERROR(`If an endpoint is given, it must be a number!`));
            } else if (endpointIndex < 0) {
              return respond(responses.ERROR(`The endpoint must not be negative!`));
            }
          }
          if (typeof commandClass !== "string" && typeof commandClass !== "number") {
            return respond(responses.ERROR(`commandClass must be a string or number`));
          } else if (typeof command !== "string") {
            return respond(responses.ERROR(`command must be a string`));
          }
          if (args != void 0 && !(0, import_typeguards.isArray)(args)) {
            return respond(responses.ERROR(`if args is given, it must be an array`));
          }
          const node = this.driver.controller.nodes.get(nodeId);
          if (!node) {
            return respond(responses.ERROR(`Node ${nodeId} was not found!`));
          }
          const endpoint = node.getEndpoint(endpointIndex != null ? endpointIndex : 0);
          if (!endpoint) {
            return respond(responses.ERROR(`Endpoint ${endpointIndex} does not exist on Node ${nodeId}!`));
          }
          let api;
          try {
            api = endpoint.commandClasses[commandClass];
          } catch (e) {
            return respond(responses.ERROR((0, import_shared2.getErrorMessage)(e)));
          }
          if (!api.isSupported()) {
            return respond(responses.ERROR(`Node ${nodeId} (Endpoint ${endpointIndex}) does not support CC ${commandClass}`));
          } else if (!(command in api)) {
            return respond(responses.ERROR(`The command ${command} does not exist for CC ${commandClass}`));
          }
          try {
            const method = api[command].bind(api);
            const result = args ? await method(...args) : await method();
            return respond(responses.RESULT(result));
          } catch (e) {
            return respond(responses.ERROR((0, import_shared2.getErrorMessage)(e)));
          }
        }
        case "subscribeLogs": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to do that!"));
          }
          if (!this.logTransport) {
            this.logTransport = new import_log_transport_json.JSONTransport();
            this.logTransport.format = (0, import_core.createDefaultTransportFormat)(true, false);
            this.driver.updateLogConfig({
              transports: [this.logTransport]
            });
            this.logTransport.stream.on("data", (data) => {
              this.pushToFrontend({
                type: "log",
                info: data
              });
            });
          }
          return respond(responses.OK);
        }
        case "unsubscribeLogs": {
          if (!this.driverReady) {
            return respond(responses.ERROR("The driver is not yet ready to do that!"));
          }
          if (this.logTransport) {
            this.driver.updateLogConfig({
              transports: []
            });
            this.logTransport.close();
            this.logTransport = void 0;
          }
          return respond(responses.OK);
        }
      }
    }
  }
}
if (module.parent) {
  module.exports = (options) => new ZWave2(options);
} else {
  (() => new ZWave2())();
}
process.on("unhandledRejection", (r) => {
  throw r;
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ZWave2
});
//# sourceMappingURL=main.js.map
