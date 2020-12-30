import * as utils from "@iobroker/adapter-core";
import { CommandClasses, Duration } from "@zwave-js/core";
import { composeObject } from "alcalzone-shared/objects";
import { isArray } from "alcalzone-shared/typeguards";
import * as fs from "fs-extra";
import * as path from "path";
import {
	Driver,
	extractFirmware,
	InterviewStage,
	NodeStatus,
	ZWaveError,
	ZWaveErrorCodes,
	ZWaveNode,
	ZWaveOptions,
} from "zwave-js";
import type {
	NodeInterviewFailedEventArgs,
	ZWaveNodeValueNotificationArgs,
} from "zwave-js/build/lib/node/Types";
import type {
	Association,
	AssociationGroup,
	CCAPI,
	CommandClass,
	FirmwareUpdateStatus,
} from "zwave-js/CommandClass";
import type { HealNodeStatus } from "zwave-js/Controller";
import type { Firmware } from "zwave-js/Utils";
import type {
	TranslatedValueID,
	ValueID,
	ZWaveNodeMetadataUpdatedArgs,
	ZWaveNodeValueAddedArgs,
	ZWaveNodeValueRemovedArgs,
	ZWaveNodeValueUpdatedArgs,
} from "zwave-js/Values";
import { guessFirmwareFormat } from "./lib/firmwareUpdate";
import { Global as _ } from "./lib/global";
import {
	computeChannelId,
	computeId,
	extendCC,
	extendMetadata,
	extendNode,
	extendNotification,
	extendNotificationValue,
	extendValue,
	nodeStatusToStatusState,
	removeNode,
	removeValue,
	setNodeReady,
	setNodeStatus,
} from "./lib/objects";
import { enumerateSerialPorts } from "./lib/serialPorts";
import {
	AssociationDefinition,
	bufferFromHex,
	computeDeviceId,
	FirmwareUpdatePollResponse,
	InclusionMode,
	isBufferAsHex,
	mapToRecord,
	NetworkHealPollResponse,
} from "./lib/shared";

export class ZWave2 extends utils.Adapter<true> {
	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "zwave2",
			objects: true,
		});
		this.on("ready", this.onReady.bind(this));
		this.on("objectChange", this.onObjectChange.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	private driver!: Driver;
	private driverReady = false;
	private readyNodes = new Set<number>();

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		// Make adapter instance global
		_.adapter = this;

		// Clear cache if we're asked to
		const cacheDir = path.join(
			utils.getAbsoluteInstanceDataDir(this),
			"cache",
		);
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
		this.setState(`info.inclusion`, InclusionMode.Idle, true);
		this.setState(`info.exclusion`, false, true);
		this.setState("info.healingNetwork", false, true);

		if (!this.config.serialport) {
			this.log.warn(
				"No serial port configured. Please select one in the adapter settings!",
			);
			return;
		}

		// Apply adapter configuration
		const timeouts: Partial<ZWaveOptions["timeouts"]> | undefined = this
			.config.driver_increaseTimeouts
			? {
					ack: 2000,
					response: 3000,
			  }
			: undefined;
		const attempts: Partial<ZWaveOptions["attempts"]> | undefined = this
			.config.driver_increaseSendAttempts
			? {
					sendData: 5,
			  }
			: undefined;
		const networkKey: Buffer | undefined =
			this.config.networkKey?.length === 32
				? Buffer.from(this.config.networkKey, "hex")
				: undefined;

		this.driver = new Driver(this.config.serialport, {
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

			this.log.info(
				`The driver is ready. Found ${this.driver.controller.nodes.size} nodes.`,
			);
			this.driver.controller
				.on("inclusion started", this.onInclusionStarted.bind(this))
				.on("exclusion started", this.onExclusionStarted.bind(this))
				.on("inclusion stopped", this.onInclusionStopped.bind(this))
				.on("exclusion stopped", this.onExclusionStopped.bind(this))
				.on("inclusion failed", this.onInclusionFailed.bind(this))
				.on("exclusion failed", this.onExclusionFailed.bind(this))
				.on("node added", this.onNodeAdded.bind(this))
				.on("node removed", this.onNodeRemoved.bind(this))
				.on(
					"heal network progress",
					this.onHealNetworkProgress.bind(this),
				)
				.on("heal network done", this.onHealNetworkDone.bind(this));

			for (const [nodeId, node] of this.driver.controller.nodes) {
				// Reset the node status
				await setNodeStatus(
					nodeId,
					nodeStatusToStatusState(node.status),
				);
				await setNodeReady(nodeId, node.ready);
				this.addNodeEventHandlers(node);

				// And immediately populate ioBroker states with the values from cache,
				// so they can be overwritten with fresh ones later
				await this.extendNodeObjectsAndStates(node);

				// Make sure we didn't miss the ready event
				if (node.ready) void this.onNodeReady(node);
			}

			// Now we know which nodes should exist - clean up orphaned nodes
			const nodeIdRegex = new RegExp(
				`^${this.name}\\.${this.instance}\\.Node_(\\d+)`,
			);
			const existingNodeIds = (Object.keys(
				await _.$$(`${this.namespace}.*`, { type: "device" }),
			)
				.map((id: string) => id.match(nodeIdRegex)?.[1])
				.filter((id) => !!id) as string[])
				.map((id) => parseInt(id, 10))
				.filter((id, index, all) => all.indexOf(id) === index);
			const unusedNodeIds = existingNodeIds.filter(
				(id) => !this.driver.controller.nodes.has(id),
			);
			for (const nodeId of unusedNodeIds) {
				this.log.warn(`Deleting orphaned node ${nodeId}`);
				await removeNode(nodeId);
			}
		});
		// Log errors from the Z-Wave lib
		this.driver.on("error", this.onZWaveError.bind(this));

		this.driver.once("all nodes ready", () => {
			this.log.info("All nodes are ready to use");
		});

		try {
			await this.driver.start();
		} catch (e) {
			this.log.error(
				`The Z-Wave driver could not be started: ${e.message}`,
			);
		}
	}

	private async onInclusionStarted(secure: boolean): Promise<void> {
		this.log.info(`${secure ? "secure" : "non-secure"} inclusion started`);
		await this.setStateAsync(
			"info.inclusion",
			secure ? InclusionMode.Secure : InclusionMode.NonSecure,
			true,
		);
	}

	private async onExclusionStarted(): Promise<void> {
		this.log.info("exclusion started");
		await this.setStateAsync("info.exclusion", true, true);
	}

	private async onInclusionStopped(): Promise<void> {
		this.log.info("inclusion stopped");
		await this.setStateAsync("info.inclusion", InclusionMode.Idle, true);
	}

	private async onExclusionStopped(): Promise<void> {
		this.log.info("exclusion stopped");
		await this.setStateAsync("info.exclusion", false, true);
	}

	private async onInclusionFailed(): Promise<void> {
		this.log.info("inclusion failed");
		await this.setStateAsync("info.inclusion", InclusionMode.Idle, true);
	}

	private async onExclusionFailed(): Promise<void> {
		this.log.info("exclusion failed");
		await this.setStateAsync("info.exclusion", false, true);
	}

	private async onNodeAdded(node: ZWaveNode): Promise<void> {
		this.log.info(`Node ${node.id}: added`);
		this.addNodeEventHandlers(node);
	}

	private async onNodeRemoved(node: ZWaveNode): Promise<void> {
		this.log.info(`Node ${node.id}: removed`);
		node.removeAllListeners();

		await removeNode(node.id);
	}

	private async onHealNetworkProgress(
		progress: ReadonlyMap<number, HealNodeStatus>,
	): Promise<void> {
		const allDone = [...progress.values()].every((v) => v !== "pending");
		// If this is the final progress report, skip it, so the frontend gets the "done" message
		if (allDone) return;
		this.respondToHealNetworkPoll({
			type: "progress",
			progress: mapToRecord(progress),
		});
	}

	private async onHealNetworkDone(
		result: ReadonlyMap<number, HealNodeStatus>,
	): Promise<void> {
		this.respondToHealNetworkPoll({
			type: "done",
			progress: mapToRecord(result),
		});
		this.setState("info.healingNetwork", false, true);
	}

	private addNodeEventHandlers(node: ZWaveNode): void {
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
			.on(
				"firmware update progress",
				this.onNodeFirmwareUpdateProgress.bind(this),
			)
			.on(
				"firmware update finished",
				this.onNodeFirmwareUpdateFinished.bind(this),
			)
			.on("notification", this.onNodeNotification.bind(this));
	}

	private async onNodeReady(node: ZWaveNode): Promise<void> {
		// Only execute this once
		if (this.readyNodes.has(node.id)) return;
		this.readyNodes.add(node.id);

		this.log.info(`Node ${node.id}: ready to use`);

		// Set the node status
		await setNodeStatus(
			node.id,
			node.id === this.driver.controller.ownNodeId
				? "alive"
				: nodeStatusToStatusState(node.status),
		);
		await setNodeReady(node.id, true);

		const allValueIDs = node.getDefinedValueIDs();
		await this.extendNodeObjectsAndStates(node, allValueIDs);
		// The controller node has no states and channels we need to clean up
		if (!node.isControllerNode()) {
			await this.cleanupNodeObjectsAndStates(node, allValueIDs);
		}
	}

	private async extendNodeObjectsAndStates(
		node: ZWaveNode,
		allValueIDs?: TranslatedValueID[],
	): Promise<void> {
		// Make sure the device object exists and is up to date
		await extendNode(node);

		// Skip channel and state creation for the controller node
		if (node.isControllerNode()) return;

		// Collect all objects and states we have values for
		allValueIDs ??= node.getDefinedValueIDs();
		const uniqueCCs = allValueIDs
			.map((vid) => [vid.commandClass, vid.commandClassName] as const)
			.filter(
				([cc], index, arr) =>
					arr.findIndex(([_cc]) => _cc === cc) === index,
			);

		// Make sure all channel objects are up to date
		for (const [cc, ccName] of uniqueCCs) {
			await extendCC(node, cc, ccName);
		}

		// Prepare data points for all the node's values. Skip this step if the interview
		// was just completed for the first time because this will incorrectly mark all fresh values as stale
		if (node.interviewStage < InterviewStage.Complete) {
			for (const valueId of allValueIDs) {
				const value = node.getValue(valueId);
				await extendValue(
					node,
					{
						...valueId,
						newValue: value,
					},
					// The value is cached
					true,
				);
			}
		}
	}

	private async cleanupNodeObjectsAndStates(
		node: ZWaveNode,
		allValueIDs?: TranslatedValueID[],
	): Promise<void> {
		// Find out which channels and states need to exist
		allValueIDs ??= node.getDefinedValueIDs();
		const uniqueCCs = allValueIDs
			.map((vid) => [vid.commandClass, vid.commandClassName] as const)
			.filter(
				([cc], index, arr) =>
					arr.findIndex(([_cc]) => _cc === cc) === index,
			);

		const nodeAbsoluteId = `${this.namespace}.${computeDeviceId(node.id)}`;

		const desiredChannelIds = new Set(
			uniqueCCs.map(
				([, ccName]) =>
					`${this.namespace}.${computeChannelId(node.id, ccName)}`,
			),
		);
		const existingChannelIds = Object.keys(
			await _.$$(`${nodeAbsoluteId}.*`, {
				type: "channel",
			}),
		);
		const desiredStateIds = new Set(
			allValueIDs.map(
				(vid) => `${this.namespace}.${computeId(node.id, vid)}`,
			),
		);
		const existingStateIds = Object.keys(
			await _.$$(`${nodeAbsoluteId}.*`, {
				type: "state",
			}),
		);

		// Clean up unused channels and states
		const unusedChannels = existingChannelIds.filter(
			(id) => !desiredChannelIds.has(id),
		);
		for (const id of unusedChannels) {
			this.log.warn(`Deleting orphaned channel ${id}`);
			try {
				await this.delObjectAsync(id);
			} catch (e) {
				/* it's fine */
			}
		}

		const unusedStates = existingStateIds
			// select those states that are not desired
			.filter((id) => !desiredStateIds.has(id))
			// filter out those states that are not under a CC channel
			.filter((id) => id.slice(nodeAbsoluteId.length + 1).includes("."))
			// and filter out those states that are for a notification event
			.filter((id) => !this.oObjects[id]?.native?.notificationEvent);

		for (const id of unusedStates) {
			this.log.warn(`Deleting orphaned state ${id}`);
			try {
				await this.delStateAsync(id);
			} catch (e) {
				/* it's fine */
			}
			try {
				await this.delObjectAsync(id);
			} catch (e) {
				/* it's fine */
			}
		}
	}

	private async ensureDeviceObject(node: ZWaveNode): Promise<void> {
		const nodeAbsoluteId = `${this.namespace}.${computeDeviceId(node.id)}`;
		if (
			!this.readyNodes.has(node.id) &&
			!(nodeAbsoluteId in this.oObjects)
		) {
			await extendNode(node);
		}
	}

	private async onNodeInterviewFailed(
		node: ZWaveNode,
		args: NodeInterviewFailedEventArgs,
	): Promise<void> {
		if (args.isFinal) {
			this.log.error(
				`Node ${node.id} interview failed: ${args.errorMessage}`,
			);
		} else {
			this.log.warn(
				`Node ${node.id} interview failed: ${args.errorMessage}`,
			);
		}
	}

	private async onNodeInterviewCompleted(node: ZWaveNode): Promise<void> {
		this.log.info(
			`Node ${node.id} interview completed, all values are updated`,
		);
	}

	private async onNodeWakeUp(
		node: ZWaveNode,
		oldStatus: NodeStatus,
	): Promise<void> {
		await setNodeStatus(node.id, "awake");
		this.log.info(
			`Node ${node.id} is ${
				oldStatus === NodeStatus.Unknown ? "" : "now "
			}awake`,
		);
	}

	private async onNodeSleep(
		node: ZWaveNode,
		oldStatus: NodeStatus,
	): Promise<void> {
		await setNodeStatus(node.id, "asleep");
		this.log.info(
			`Node ${node.id} is ${
				oldStatus === NodeStatus.Unknown ? "" : "now "
			}asleep`,
		);

		// ensure we have a device object or users cannot remove failed nodes from the network
		await this.ensureDeviceObject(node);
	}

	private async onNodeAlive(
		node: ZWaveNode,
		oldStatus: NodeStatus,
	): Promise<void> {
		await setNodeStatus(node.id, "alive");
		if (oldStatus === NodeStatus.Dead) {
			this.log.info(`Node ${node.id}: has returned from the dead`);
		} else {
			this.log.info(`Node ${node.id} is alive`);
		}
	}

	private async onNodeDead(
		node: ZWaveNode,
		oldStatus: NodeStatus,
	): Promise<void> {
		await setNodeStatus(node.id, "dead");
		this.log.info(
			`Node ${node.id} is ${
				oldStatus === NodeStatus.Unknown ? "" : "now "
			}dead`,
		);

		// ensure we have a device object or users cannot remove failed nodes from the network
		await this.ensureDeviceObject(node);
	}

	private async onNodeValueAdded(
		node: ZWaveNode,
		args: ZWaveNodeValueAddedArgs,
	): Promise<void> {
		let propertyName = computeId(node.id, args);
		propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
		this.log.debug(
			`Node ${node.id}: value added: ${propertyName} => ${String(
				args.newValue,
			)}`,
		);
		await extendValue(node, args);
		if (this.config.switchCompat) await this.syncSwitchStates(node, args);
	}

	private async onNodeValueUpdated(
		node: ZWaveNode,
		args: ZWaveNodeValueUpdatedArgs,
	): Promise<void> {
		let propertyName = computeId(node.id, args);
		propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
		this.log.debug(
			`Node ${node.id}: value updated: ${propertyName} => ${String(
				args.newValue,
			)}`,
		);
		await extendValue(node, args);
		if (this.config.switchCompat) await this.syncSwitchStates(node, args);
	}

	private async onNodeValueNotification(
		node: ZWaveNode,
		args: ZWaveNodeValueNotificationArgs,
	): Promise<void> {
		let propertyName = computeId(node.id, args);
		propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
		this.log.debug(
			`Node ${node.id}: value notification: ${propertyName} = ${String(
				args.value,
			)}`,
		);
		await extendNotificationValue(node, args);
	}

	/** Overwrites `targetValue` states with `currentValue` */
	private async syncSwitchStates(
		node: ZWaveNode,
		args: ZWaveNodeValueAddedArgs | ZWaveNodeValueUpdatedArgs,
	): Promise<void> {
		if (
			(args.commandClass === CommandClasses["Binary Switch"] ||
				args.commandClass === CommandClasses["Multilevel Switch"]) &&
			args.property === "currentValue"
		) {
			await extendValue(node, {
				...args,
				property: "targetValue",
				propertyName: "targetValue",
			});
		}
	}

	private async onNodeValueRemoved(
		node: ZWaveNode,
		args: ZWaveNodeValueRemovedArgs,
	): Promise<void> {
		let propertyName = computeId(node.id, args);
		propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
		this.log.debug(`Node ${node.id}: value removed: ${propertyName}`);
		await removeValue(node.id, args);
	}

	private async onNodeMetadataUpdated(
		node: ZWaveNode,
		args: ZWaveNodeMetadataUpdatedArgs,
	): Promise<void> {
		let propertyName = computeId(node.id, args);
		propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
		this.log.debug(`Node ${node.id}: metadata updated: ${propertyName}`);
		await extendMetadata(node, args);
	}

	private async onNodeFirmwareUpdateProgress(
		node: ZWaveNode,
		sentFragments: number,
		totalFragments: number,
	): Promise<void> {
		this.respondToFirmwareUpdatePoll({
			type: "progress",
			sentFragments,
			totalFragments,
		});
	}

	private async onNodeFirmwareUpdateFinished(
		node: ZWaveNode,
		status: FirmwareUpdateStatus,
		waitTime?: number,
	): Promise<void> {
		this.respondToFirmwareUpdatePoll({
			type: "done",
			status,
			waitTime,
		});
	}

	private async onNodeNotification(
		node: ZWaveNode,
		notificationLabel: string,
		parameters?:
			| Buffer
			| Duration
			| CommandClass
			| Record<string, number>
			| undefined,
	): Promise<void> {
		this.log.debug(
			`Node ${node.id}: received notification: ${notificationLabel}`,
		);
		await extendNotification(node, notificationLabel, parameters);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private async onUnload(callback: () => void): Promise<void> {
		try {
			this.log.info("Shutting down driver...");
			const allNodeIds = [...this.driver.controller.nodes.keys()];
			await this.driver.destroy();

			this.log.info("Resetting node status...");
			for (const nodeId of allNodeIds) {
				await setNodeStatus(nodeId, "unknown");
				await setNodeReady(nodeId, false);
			}

			this.log.info("Cleaned everything up!");
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * Is called when the Z-Wave lib has a non-critical error
	 */
	private async onZWaveError(error: Error): Promise<void> {
		let level: "warn" | "error" = "error";
		// Treat non-critical errors as warnings
		if (
			error instanceof ZWaveError &&
			error.code === ZWaveErrorCodes.Controller_NodeInsecureCommunication
		) {
			level = "warn";
		}

		this.log[level](error.message);

		if (
			error instanceof ZWaveError &&
			error.code === ZWaveErrorCodes.Driver_Failed
		) {
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
	private onObjectChange(
		id: string,
		obj: ioBroker.Object | null | undefined,
	): void {
		if (obj) {
			// The object was changed
			this.log.debug(`object ${id} changed: ${JSON.stringify(obj)}`);
		} else {
			// The object was deleted
			this.log.debug(`object ${id} deleted`);
		}
	}

	/**
	 * Is called if a subscribed state changes
	 */
	private async onStateChange(
		id: string,
		state: ioBroker.State | null | undefined,
	): Promise<void> {
		if (state) {
			// The state was changed
			if (!state.ack) {
				// Make sure we can already use the Z-Wave driver
				if (!this.driverReady) {
					this.log.warn(
						`The driver is not yet ready, ignoring state change for "${id}"`,
					);
					return;
				}

				// Handle some special states first
				if (id.endsWith("info.inclusion")) {
					if (state.val) await this.setExclusionMode(false);
					await this.setInclusionMode(state.val as any);
					return;
				} else if (id.endsWith("info.exclusion")) {
					if (state.val)
						await this.setInclusionMode(InclusionMode.Idle);
					await this.setExclusionMode(state.val as any);
					return;
				}

				// Otherwise perform the default handling for values
				const obj = this.oObjects[id];
				if (!obj) {
					this.log.error(
						`Object definition for state ${id} is missing!`,
					);
					// TODO: Capture this with sentry?
					return;
				}

				const { native } = obj;
				const nodeId: number | undefined = native.nodeId;
				if (!nodeId) {
					this.log.error(
						`Node ID missing from object definition ${id}!`,
					);
					return;
				}
				const valueId: ValueID | undefined = native.valueId;
				if (!(valueId && valueId.commandClass && valueId.property)) {
					this.log.error(
						`Value ID missing or incomplete in object definition ${id}!`,
					);
					return;
				}
				const node = this.driver.controller.nodes.get(nodeId);
				if (!node) {
					this.log.error(`Node ${nodeId} does not exist!`);
					return;
				}

				// Some CCs accept Buffers. In order to edit them in ioBroker, we support parsing strings like "0xbada55" as Buffers.
				let newValue: unknown = state.val;
				if (typeof newValue === "string" && isBufferAsHex(newValue)) {
					newValue = bufferFromHex(newValue);
				}

				try {
					await node.setValue(valueId, newValue);
					// Don't use newValue to update ioBroker states, these are only for zwave-js
					await this.setStateAsync(id, { val: state.val, ack: true });
				} catch (e) {
					this.log.error(e.message);
				}
			}
		} /* else {
			// The state was deleted
		} */
	}

	private async setInclusionMode(mode: InclusionMode): Promise<void> {
		try {
			if (mode !== InclusionMode.Idle) {
				await this.driver.controller.beginInclusion(
					mode === InclusionMode.NonSecure,
				);
			} else {
				await this.driver.controller.stopInclusion();
			}
		} catch (e) {
			/* nothing to do */
			this.log.error(e.message);
		}
	}

	private async setExclusionMode(active: boolean): Promise<void> {
		try {
			if (active) {
				await this.driver.controller.beginExclusion();
			} else {
				await this.driver.controller.stopExclusion();
			}
		} catch (e) {
			/* nothing to do */
			this.log.error(e.message);
		}
	}

	// This is used to store responses if something changed between two calls
	private healNetworkPollResponse: NetworkHealPollResponse | undefined;
	// This is used to store the callback if there was no response yet
	private healNetworkPollCallback:
		| ((response: NetworkHealPollResponse) => void)
		| undefined;

	/** Responds to a pending poll from the frontend (if there is a message outstanding) */
	private respondToHealNetworkPoll(response: NetworkHealPollResponse): void {
		if (typeof this.healNetworkPollCallback === "function") {
			// If the client is waiting for a response, send it immediately
			this.healNetworkPollCallback(response);
			this.healNetworkPollCallback = undefined;
		} else {
			// otherwise remember the response for the next call
			this.healNetworkPollResponse = response;
		}
	}

	// This is used to store responses if something changed between two calls
	private firmwareUpdatePollResponse: FirmwareUpdatePollResponse | undefined;
	// This is used to store the callback if there was no response yet
	private firmwareUpdatePollCallback:
		| ((response: FirmwareUpdatePollResponse) => void)
		| undefined;

	/** Responds to a pending poll from the frontend (if there is a message outstanding) */
	private respondToFirmwareUpdatePoll(
		response: FirmwareUpdatePollResponse,
	): void {
		if (typeof this.firmwareUpdatePollCallback === "function") {
			// If the client is waiting for a response, send it immediately
			this.firmwareUpdatePollCallback(response);
			this.firmwareUpdatePollCallback = undefined;
		} else {
			// otherwise remember the response for the next call
			this.firmwareUpdatePollResponse = response;
		}
	}

	/**
	 * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	 * Using this method requires "common.message" property to be set to true in io-package.json
	 */
	private async onMessage(obj: ioBroker.Message): Promise<void> {
		// responds to the adapter that sent the original message
		const respond = (response: any): void => {
			if (obj.callback)
				this.sendTo(obj.from, obj.command, response, obj.callback);
		};
		// some predefined responses so we only have to define them once
		const responses = {
			ACK: { error: null },
			OK: { error: null, result: "ok" },
			ERROR_UNKNOWN_COMMAND: { error: "Unknown command!" },
			MISSING_PARAMETER: (paramName: string) => {
				return { error: 'missing parameter "' + paramName + '"!' };
			},
			COMMAND_ACTIVE: { error: "command already active" },
			RESULT: (result: unknown) => ({ error: null, result }),
			ERROR: (error: string) => ({ error }),
		};

		function requireParams(...params: string[]): boolean {
			if (!params.length) return true;
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
						return respond(
							responses.ERROR(
								"The driver is not yet ready to show the network map!",
							),
						);
					}

					const map = [...this.driver.controller.nodes.values()].map(
						(node) => ({
							id: node.id,
							name: `Node ${node.id}`,
							neighbors: node.neighbors,
						}),
					);
					respond(responses.RESULT(map));
					return;
				}

				case "getSerialPorts": {
					const ports = await enumerateSerialPorts(this);
					respond(responses.RESULT(ports));
					return;
				}

				case "beginHealingNetwork": {
					if (!this.driverReady) {
						return respond(
							responses.ERROR(
								"The driver is not yet ready to heal the network!",
							),
						);
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
						return respond(
							responses.ERROR(
								"The driver is not yet ready to heal the network!",
							),
						);
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
					} else {
						// otherwise remember the callback for a later response
						this.respondToHealNetworkPoll = (result) =>
							respond(responses.RESULT(result));
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
						return respond(
							responses.ERROR(
								"The driver is not yet ready to do that!",
							),
						);
					}
					if (!requireParams("nodeId")) return;
					const params = (obj.message as any) as Record<string, any>;

					try {
						await this.driver.controller.removeFailedNode(
							params.nodeId,
						);
					} catch (e) {
						return respond(
							responses.ERROR(
								`Could not remove node ${params.nodeId}: ${e.message}`,
							),
						);
					}
					return respond(responses.OK);
				}

				case "getAssociationGroups": {
					if (!this.driverReady) {
						return respond(
							responses.ERROR(
								"The driver is not yet ready to do that!",
							),
						);
					}
					if (!requireParams("nodeId")) return;
					const params = (obj.message as any) as Record<string, any>;
					const nodeId: number = params.nodeId;

					try {
						const groups = this.driver.controller.getAssociationGroups(
							nodeId,
						);
						// convert map into object
						const ret = composeObject([...groups] as [
							any,
							AssociationGroup,
						][]);
						return respond(responses.RESULT(ret));
					} catch (e) {
						return respond(
							responses.ERROR(
								`Could not get association groups for node ${params.nodeId}: ${e.message}`,
							),
						);
					}
				}

				case "getAssociations": {
					if (!this.driverReady) {
						return respond(
							responses.ERROR(
								"The driver is not yet ready to do that!",
							),
						);
					}
					if (!requireParams("nodeId")) return;
					const params = (obj.message as any) as Record<string, any>;
					const nodeId: number = params.nodeId;

					try {
						const assocs = this.driver.controller.getAssociations(
							nodeId,
						);
						// convert map into object
						const ret = composeObject([...assocs] as [
							any,
							Association[],
						][]);
						return respond(responses.RESULT(ret));
					} catch (e) {
						return respond(
							responses.ERROR(
								`Could not get associations for node ${params.nodeId}: ${e.message}`,
							),
						);
					}
				}

				case "addAssociation": {
					if (!this.driverReady) {
						return respond(
							responses.ERROR(
								"The driver is not yet ready to do that!",
							),
						);
					}
					if (!requireParams("nodeId", "association")) return;
					const params = (obj.message as any) as Record<string, any>;
					const nodeId: number = params.nodeId;
					const definition: AssociationDefinition =
						params.association;

					try {
						await this.driver.controller.addAssociations(
							nodeId,
							definition.groupId,
							[
								{
									nodeId: definition.targetNodeId,
									endpoint: definition.endpoint,
								},
							],
						);
						return respond(responses.OK);
					} catch (e) {
						return respond(
							responses.ERROR(
								`Could not add association for node ${params.nodeId}: ${e.message}`,
							),
						);
					}
				}

				case "removeAssociation": {
					if (!this.driverReady) {
						return respond(
							responses.ERROR(
								"The driver is not yet ready to do that!",
							),
						);
					}
					if (!requireParams("nodeId", "association")) return;
					const params = (obj.message as any) as Record<string, any>;
					const nodeId: number = params.nodeId;
					const definition: AssociationDefinition =
						params.association;

					try {
						await this.driver.controller.removeAssociations(
							nodeId,
							definition.groupId,
							[
								{
									nodeId: definition.targetNodeId,
									endpoint: definition.endpoint,
								},
							],
						);
						return respond(responses.OK);
					} catch (e) {
						return respond(
							responses.ERROR(
								`Could not remove association for node ${params.nodeId}: ${e.message}`,
							),
						);
					}
				}

				case "refreshNodeInfo": {
					if (!this.driverReady) {
						return respond(
							responses.ERROR(
								"The driver is not yet ready to do that!",
							),
						);
					}
					if (!requireParams("nodeId")) return;
					const { nodeId } = obj.message as any;

					try {
						await this.driver.controller.nodes
							.get(nodeId)!
							.refreshInfo();
						this.readyNodes.delete(nodeId);
						this.log.info(`Node ${nodeId}: interview restarted`);
					} catch (e) {
						return respond(
							responses.ERROR(
								`Could not refresh info for node ${nodeId}: ${e.message}`,
							),
						);
					}
					return respond(responses.OK);
				}

				case "beginFirmwareUpdate": {
					if (!this.driverReady) {
						return respond(
							responses.ERROR(
								"The driver is not yet ready to do that!",
							),
						);
					}
					if (!requireParams("nodeId", "filename", "firmware"))
						return;
					const { nodeId, filename, firmware } = obj.message as any;
					if (
						isArray(firmware) &&
						firmware.every(
							(byte: unknown) => typeof byte === "number",
						)
					) {
						// Extract the firmware from the uploaded file
						const rawData = Buffer.from(firmware);
						let actualFirmware: Firmware;
						try {
							const format = guessFirmwareFormat(
								filename,
								rawData,
							);
							actualFirmware = extractFirmware(rawData, format);
						} catch (e) {
							return respond(responses.ERROR(e.message));
						}

						// And try to start the update
						try {
							await this.driver.controller.nodes
								.get(nodeId)!
								.beginFirmwareUpdate(
									actualFirmware.data,
									actualFirmware.firmwareTarget,
								);
							this.log.info(
								`Node ${nodeId}: Firmware update started`,
							);
							return respond(responses.OK);
						} catch (e) {
							if (
								e instanceof ZWaveError &&
								e.code === ZWaveErrorCodes.FirmwareUpdateCC_Busy
							) {
								return respond(responses.COMMAND_ACTIVE);
							} else {
								return respond(responses.ERROR(e.message));
							}
						}
					} else {
						return respond(
							responses.ERROR("The firmware data is invalid!"),
						);
					}
				}

				case "firmwareUpdatePoll": {
					if (this.firmwareUpdatePollResponse) {
						// if a response is waiting to be asked for, send it immediately
						respond(
							responses.RESULT(this.firmwareUpdatePollResponse),
						);
						this.firmwareUpdatePollResponse = undefined;
					} else {
						// otherwise remember the callback for a later response
						this.respondToFirmwareUpdatePoll = (result) =>
							respond(responses.RESULT(result));
					}

					return;
				}

				case "abortFirmwareUpdate": {
					if (!this.driverReady) {
						return respond(
							responses.ERROR(
								"The driver is not yet ready to do that!",
							),
						);
					}
					if (!requireParams("nodeId")) return;
					const { nodeId } = obj.message as any;

					try {
						await this.driver.controller.nodes
							.get(nodeId)!
							.abortFirmwareUpdate();
						this.log.info(
							`Node ${nodeId}: Firmware update aborted`,
						);
						return respond(responses.OK);
					} catch (e) {
						return respond(responses.ERROR(e.message));
					}
				}

				case "sendCommand": {
					if (!this.driverReady) {
						return respond(
							responses.ERROR(
								"The driver is not yet ready to do that!",
							),
						);
					}

					// Check that we got the params we need
					if (!requireParams("nodeId", "commandClass", "command"))
						return;
					const {
						nodeId,
						endpoint: endpointIndex,
						commandClass,
						command,
						args,
					} = obj.message as any;
					if (typeof nodeId !== "number") {
						return respond(
							responses.ERROR(`nodeId must be a number`),
						);
					}
					if (endpointIndex != undefined) {
						if (typeof endpointIndex !== "number") {
							return respond(
								responses.ERROR(
									`If an endpoint is given, it must be a number!`,
								),
							);
						} else if (endpointIndex < 0) {
							return respond(
								responses.ERROR(
									`The endpoint must not be negative!`,
								),
							);
						}
					}
					if (
						typeof commandClass !== "string" &&
						typeof commandClass !== "number"
					) {
						return respond(
							responses.ERROR(
								`commandClass must be a string or number`,
							),
						);
					} else if (typeof command !== "string") {
						return respond(
							responses.ERROR(`command must be a string`),
						);
					}
					if (args != undefined && !isArray(args)) {
						return respond(
							responses.ERROR(
								`if args is given, it must be an array`,
							),
						);
					}

					const node = this.driver.controller.nodes.get(nodeId);
					if (!node) {
						return respond(
							responses.ERROR(`Node ${nodeId} was not found!`),
						);
					}
					const endpoint = node.getEndpoint(endpointIndex ?? 0);
					if (!endpoint) {
						return respond(
							responses.ERROR(
								`Endpoint ${endpointIndex} does not exist on Node ${nodeId}!`,
							),
						);
					}
					let api: CCAPI;
					try {
						api = (endpoint.commandClasses as any)[commandClass];
					} catch (e) {
						return respond(responses.ERROR(e.message));
					}
					if (!api.isSupported()) {
						return respond(
							responses.ERROR(
								`Node ${nodeId} (Endpoint ${endpointIndex}) does not support CC ${commandClass}`,
							),
						);
					} else if (!(command in api)) {
						return respond(
							responses.ERROR(
								`The command ${command} does not exist for CC ${commandClass}`,
							),
						);
					}

					try {
						const method = (api as any)[command].bind(api);
						const result = args
							? await method(...args)
							: await method();
						return respond(responses.RESULT(result));
					} catch (e) {
						return respond(responses.ERROR(e.message));
					}
				}
			}
		}
	}
}

if (module.parent) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) =>
		new ZWave2(options);
} else {
	// otherwise start the instance directly
	(() => new ZWave2())();
}

process.on("unhandledRejection", (r) => {
	throw r;
});
