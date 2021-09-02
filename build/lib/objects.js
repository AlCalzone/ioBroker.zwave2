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
  ccNameToChannelIdFragment: () => ccNameToChannelIdFragment,
  computeChannelId: () => computeChannelId,
  computeId: () => computeId,
  computeNotificationId: () => computeNotificationId,
  extendCC: () => extendCC,
  extendMetadata: () => extendMetadata,
  extendNode: () => extendNode,
  extendNotificationValue: () => extendNotificationValue,
  extendNotification_NotificationCC: () => extendNotification_NotificationCC,
  extendValue: () => extendValue,
  nameToStateId: () => nameToStateId,
  nodeStatusToStatusState: () => nodeStatusToStatusState,
  removeNode: () => removeNode,
  removeValue: () => removeValue,
  setNodeReady: () => setNodeReady,
  setNodeStatus: () => setNodeStatus,
  setRFRegionState: () => setRFRegionState
});
var import_core = __toModule(require("@zwave-js/core"));
var import_objects = __toModule(require("alcalzone-shared/objects"));
var import_strings = __toModule(require("alcalzone-shared/strings"));
var import_typeguards = __toModule(require("alcalzone-shared/typeguards"));
var import_zwave_js = __toModule(require("zwave-js"));
var import_Node = __toModule(require("zwave-js/Node"));
var import_global = __toModule(require("./global"));
var import_shared = __toModule(require("./shared"));
function nodeStatusToStatusState(status) {
  switch (status) {
    case import_Node.NodeStatus.Awake:
      return "awake";
    case import_Node.NodeStatus.Asleep:
      return "asleep";
    case import_Node.NodeStatus.Alive:
      return "alive";
    case import_Node.NodeStatus.Dead:
      return "dead";
    case import_Node.NodeStatus.Unknown:
      return "unknown";
  }
}
function safeValue(value) {
  if (value == void 0)
    return null;
  if (Buffer.isBuffer(value)) {
    return (0, import_shared.buffer2hex)(value);
  } else if ((0, import_typeguards.isArray)(value) || (0, import_typeguards.isObject)(value)) {
    return JSON.stringify(value);
  }
  return value;
}
const isCamelCasedSafeNameRegex = /^(?!.*[\-_]$)[a-z]([a-zA-Z0-9\-_]+)$/;
function nameToStateId(label) {
  if (isCamelCasedSafeNameRegex.test(label))
    return label;
  let safeName = label;
  while (true) {
    let replaced = safeName;
    replaced = replaced.trim();
    replaced = replaced.replace(/\s+/g, " ");
    replaced = replaced.replace(/[^a-zA-Z0-9\-_ ]+/g, "_");
    replaced = replaced.replace(/_\s/g, " ");
    replaced = replaced.replace(/\s_/g, " ");
    replaced = replaced.replace(/^_\s*/, "");
    replaced = replaced.replace(/\s*_$/, "");
    if (safeName === replaced)
      break;
    safeName = replaced;
  }
  return camelCase(safeName);
}
function camelCase(str) {
  return str.split(" ").map((substr, i) => i === 0 ? substr.toLowerCase() : substr[0].toUpperCase() + substr.slice(1).toLowerCase()).join("");
}
function ccNameToChannelIdFragment(ccName) {
  return ccName.replace(/[\s]+/g, "_");
}
function computeChannelId(nodeId, ccName) {
  return `${(0, import_shared.computeDeviceId)(nodeId)}.${ccNameToChannelIdFragment(ccName)}`;
}
function computeId(nodeId, args) {
  var _a, _b;
  return [
    (0, import_shared.computeDeviceId)(nodeId),
    ccNameToChannelIdFragment(args.commandClassName),
    [
      ((_a = args.propertyName) == null ? void 0 : _a.trim()) && nameToStateId(args.propertyName),
      args.endpoint && (0, import_strings.padStart)(args.endpoint.toString(), 3, "0"),
      ((_b = args.propertyKeyName) == null ? void 0 : _b.trim()) && nameToStateId(args.propertyKeyName)
    ].filter((s) => !!s).join("_")
  ].join(".");
}
const secClassDefinitions = [
  [import_core.SecurityClass.S2_AccessControl, import_core.CommandClasses["Security 2"]],
  [import_core.SecurityClass.S2_Authenticated, import_core.CommandClasses["Security 2"]],
  [import_core.SecurityClass.S2_Unauthenticated, import_core.CommandClasses["Security 2"]],
  [import_core.SecurityClass.S0_Legacy, import_core.CommandClasses["Security"]]
];
function securityClassesToRecord(node) {
  const ret = {};
  for (const [secClass, cc] of secClassDefinitions) {
    if (!node.supportsCC(cc))
      continue;
    ret[import_core.SecurityClass[secClass]] = node.hasSecurityClass(secClass) === true;
  }
  return ret;
}
function nodeToNative(node) {
  return __spreadProps(__spreadValues({
    id: node.id,
    isControllerNode: node.isControllerNode(),
    manufacturerId: node.manufacturerId,
    productType: node.productType,
    productId: node.productId
  }, node.deviceClass && {
    type: {
      basic: node.deviceClass.basic.label,
      generic: node.deviceClass.generic.label,
      specific: node.deviceClass.specific.label
    }
  }), {
    endpointIndizes: node.getEndpointIndizes(),
    securityClasses: securityClassesToRecord(node),
    secure: node.isSecure,
    supportsFirmwareUpdate: node.supportsCC(import_core.CommandClasses["Firmware Update Meta Data"])
  });
}
function nodeToCommon(node) {
  return {
    name: node.deviceConfig ? `${node.deviceConfig.manufacturer} ${node.deviceConfig.label}` : `Node ${(0, import_strings.padStart)(node.id.toString(), 3, "0")}`
  };
}
const fallbackNodeNameRegex = /^Node \d+$/;
async function extendNode(node) {
  const deviceId = (0, import_shared.computeDeviceId)(node.id);
  const originalObject = import_global.Global.adapter.oObjects[`${import_global.Global.adapter.namespace}.${deviceId}`];
  const nodeCommon = nodeToCommon(node);
  let newName = originalObject == null ? void 0 : originalObject.common.name;
  newName = newName && !fallbackNodeNameRegex.test(newName) ? newName : nodeCommon.name;
  const desiredObject = {
    type: "device",
    common: __spreadProps(__spreadValues(__spreadValues({}, nodeCommon), originalObject == null ? void 0 : originalObject.common), {
      name: newName
    }),
    native: nodeToNative(node)
  };
  await setOrExtendObject(deviceId, desiredObject, originalObject);
}
async function removeNode(nodeId) {
  const deviceId = `${import_global.Global.adapter.namespace}.${(0, import_shared.computeDeviceId)(nodeId)}`;
  try {
    await import_global.Global.adapter.delForeignObjectAsync(deviceId);
  } catch (e) {
  }
  const existingObjs = __spreadValues(__spreadValues({}, await import_global.Global.$$(`${deviceId}.*`, {type: "channel"})), await import_global.Global.$$(`${deviceId}.*`, {type: "state"}));
  for (const [id, obj] of (0, import_objects.entries)(existingObjs)) {
    if (obj.type === "state") {
      try {
        await import_global.Global.adapter.delForeignStateAsync(id);
      } catch (e) {
      }
    }
    try {
      await import_global.Global.adapter.delForeignObjectAsync(id);
    } catch (e) {
    }
  }
}
async function extendCC(node, cc, ccName) {
  const channelId = computeChannelId(node.id, ccName);
  const common = {
    name: ccName
  };
  const native = {
    cc,
    version: node.getCCVersion(cc)
  };
  const originalObject = import_global.Global.adapter.oObjects[`${import_global.Global.adapter.namespace}.${channelId}`];
  if (originalObject == void 0) {
    await import_global.Global.adapter.setObjectAsync(channelId, {
      type: "channel",
      common,
      native
    });
  } else if (JSON.stringify(common) !== JSON.stringify(originalObject.common) || JSON.stringify(native) !== JSON.stringify(originalObject.native)) {
    await import_global.Global.adapter.extendObjectAsync(channelId, {
      common,
      native
    });
  }
}
async function extendValue(node, args, fromCache = false) {
  const stateId = computeId(node.id, args);
  await extendMetadata(node, args);
  try {
    const state = {
      val: safeValue(args.newValue),
      ack: true
    };
    if (fromCache) {
      state.q = 64;
    }
    if (fromCache) {
      await import_global.Global.adapter.setStateChangedAsync(stateId, state);
    } else {
      await import_global.Global.adapter.setStateAsync(stateId, state);
    }
  } catch (e) {
    import_global.Global.adapter.log.error(`Cannot set state "${stateId}" in ioBroker: ${(0, import_shared.getErrorMessage)(e)}`);
  }
}
async function extendNotificationValue(node, args) {
  const stateId = computeId(node.id, args);
  await extendMetadata(node, args);
  try {
    const state = {
      val: safeValue(args.value),
      ack: true,
      expire: 1
    };
    await import_global.Global.adapter.setStateAsync(stateId, state);
  } catch (e) {
    import_global.Global.adapter.log.error(`Cannot set state "${stateId}" in ioBroker: ${(0, import_shared.getErrorMessage)(e)}`);
  }
}
async function extendMetadata(node, args) {
  const stateId = computeId(node.id, args);
  const metadata = "metadata" in args && args.metadata || node.getValueMetadata(args);
  const stateType = valueTypeToIOBrokerType(metadata.type);
  const stateRole = metadataToStateRole(stateType, metadata);
  const originalObject = import_global.Global.adapter.oObjects[`${import_global.Global.adapter.namespace}.${stateId}`];
  const newStateName = import_global.Global.adapter.config.preserveStateNames && (originalObject == null ? void 0 : originalObject.common.name) ? originalObject.common.name : metadata.label ? `${metadata.label}${args.endpoint ? ` (Endpoint ${args.endpoint})` : ""}` : stateId;
  const objectDefinition = {
    type: "state",
    common: {
      role: stateRole,
      read: metadata.readable,
      write: metadata.writeable,
      name: newStateName,
      desc: metadata.description,
      type: stateType,
      min: metadata.min,
      max: metadata.max,
      def: metadata.default,
      unit: metadata.unit,
      states: metadata.states
    },
    native: {
      nodeId: node.id,
      valueId: {
        commandClass: args.commandClass,
        endpoint: args.endpoint,
        property: args.property,
        propertyKey: args.propertyKey
      },
      steps: metadata.steps
    }
  };
  await setOrExtendObject(stateId, objectDefinition, originalObject);
}
async function removeValue(nodeId, args) {
  const stateId = computeId(nodeId, args);
  try {
    await import_global.Global.adapter.delObjectAsync(stateId);
  } catch (e) {
  }
}
function valueTypeToIOBrokerType(valueType) {
  switch (valueType) {
    case "number":
    case "boolean":
    case "string":
      return valueType;
    case "any":
      return "mixed";
    default:
      if (valueType.endsWith("[]"))
        return "array";
  }
  return "mixed";
}
function metadataToStateRole(stateType, meta) {
  if (stateType === "number") {
    return meta.writeable ? "level" : "value";
  } else if (stateType === "boolean") {
    return meta.readable && meta.writeable ? "switch" : meta.readable ? "indicator" : "button";
  }
  return "state";
}
async function setNodeStatus(nodeId, status) {
  const stateId = `${(0, import_shared.computeDeviceId)(nodeId)}.status`;
  await import_global.Global.adapter.setObjectNotExistsAsync(stateId, {
    type: "state",
    common: {
      name: "Node status",
      role: "indicator",
      type: "string",
      read: true,
      write: false
    },
    native: {}
  });
  await import_global.Global.adapter.setStateAsync(stateId, status, true);
}
async function setNodeReady(nodeId, ready) {
  const stateId = `${(0, import_shared.computeDeviceId)(nodeId)}.ready`;
  await import_global.Global.adapter.setObjectNotExistsAsync(stateId, {
    type: "state",
    common: {
      name: "Ready to use",
      role: "indicator",
      type: "boolean",
      read: true,
      write: false,
      def: false
    },
    native: {}
  });
  await import_global.Global.adapter.setStateAsync(stateId, ready, true);
}
function computeNotificationId(nodeId, notificationLabel, eventLabel, property) {
  return [
    (0, import_shared.computeDeviceId)(nodeId),
    ccNameToChannelIdFragment("Notification"),
    [
      nameToStateId(notificationLabel),
      nameToStateId(eventLabel),
      property && nameToStateId(property)
    ].filter((s) => !!s).join("_")
  ].join(".");
}
async function setOrExtendObject(id, definition, original) {
  if (original == void 0) {
    await import_global.Global.adapter.setObjectAsync(id, definition);
  } else if (JSON.stringify(definition.common) !== JSON.stringify(original.common) || JSON.stringify(definition.native) !== JSON.stringify(original.native)) {
    await import_global.Global.adapter.extendObjectAsync(id, definition);
  }
}
async function setNotificationValue(nodeId, notificationLabel, eventLabel, property, value = true) {
  var _a;
  const stateId = computeNotificationId(nodeId, notificationLabel, eventLabel, property);
  const originalObject = import_global.Global.adapter.oObjects[`${import_global.Global.adapter.namespace}.${stateId}`];
  const newStateName = import_global.Global.adapter.config.preserveStateNames && (originalObject == null ? void 0 : originalObject.common.name) ? originalObject.common.name : `${notificationLabel}: ${eventLabel}${!!property ? ` (${property})` : ""}`;
  const objectDefinition = {
    type: "state",
    common: typeof value === "boolean" ? {
      role: "indicator",
      read: true,
      write: false,
      name: newStateName,
      type: "boolean"
    } : typeof value === "number" ? {
      role: "value",
      read: true,
      write: false,
      name: newStateName,
      type: "number"
    } : value instanceof import_core.Duration ? {
      role: "value.interval",
      read: true,
      write: false,
      name: newStateName,
      type: "number",
      unit: "seconds"
    } : {
      role: "text",
      read: true,
      write: false,
      name: newStateName,
      type: "string"
    },
    native: {
      nodeId,
      notificationEvent: true
    }
  };
  let val;
  if (value instanceof import_core.Duration) {
    val = value.toMilliseconds();
    if (val == void 0)
      val = "unknown";
    else
      val /= 1e3;
  } else {
    val = value;
  }
  await setOrExtendObject(stateId, objectDefinition, originalObject);
  await import_global.Global.adapter.setStateAsync(stateId, {
    val,
    expire: (_a = import_global.Global.adapter.config.notificationEventValidity) != null ? _a : 1e3
  }, true);
}
async function extendNotification_NotificationCC(node, args) {
  const {label, eventLabel, parameters} = args;
  if (parameters == void 0) {
    await setNotificationValue(node.id, label, eventLabel, void 0, true);
  } else if (Buffer.isBuffer(parameters)) {
    await setNotificationValue(node.id, label, eventLabel, void 0, parameters.toString("hex"));
  } else if (parameters instanceof import_core.Duration) {
    await setNotificationValue(node.id, label, eventLabel, void 0, parameters);
  } else {
    for (const [key, value] of Object.entries(parameters)) {
      await setNotificationValue(node.id, label, eventLabel, key, value);
    }
  }
}
async function setRFRegionState(rfRegion) {
  const stateId = `info.rfRegion`;
  await import_global.Global.adapter.setObjectNotExistsAsync(stateId, {
    type: "state",
    common: {
      name: "RF Region",
      role: "info.region",
      type: "number",
      read: true,
      write: false,
      states: (0, import_core.enumValuesToMetadataStates)(import_zwave_js.RFRegion)
    },
    native: {}
  });
  await import_global.Global.adapter.setStateAsync(stateId, rfRegion != null ? rfRegion : null, true);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ccNameToChannelIdFragment,
  computeChannelId,
  computeId,
  computeNotificationId,
  extendCC,
  extendMetadata,
  extendNode,
  extendNotificationValue,
  extendNotification_NotificationCC,
  extendValue,
  nameToStateId,
  nodeStatusToStatusState,
  removeNode,
  removeValue,
  setNodeReady,
  setNodeStatus,
  setRFRegionState
});
//# sourceMappingURL=objects.js.map
