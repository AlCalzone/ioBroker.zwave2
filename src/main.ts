import * as utils from "@iobroker/adapter-core";
import { Driver, ZWaveNode } from "zwave-js";
import {
	ZWaveNodeValueAddedArgs,
	ZWaveNodeValueRemovedArgs,
	ZWaveNodeValueUpdatedArgs,
} from "zwave-js/build/lib/node/Node";
import { Global as _ } from "./lib/global";
import { extendValue, removeValue } from "./lib/objects";

// Augment the adapter.config object with the actual types
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace ioBroker {
		interface AdapterConfig {
			serialport: string;
		}
	}
}

class Zwave2 extends utils.Adapter {
	public constructor(options: Partial<ioBroker.AdapterOptions> = {}) {
		super({
			...options,
			name: "zwave2",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("objectChange", this.onObjectChange.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	private driver!: Driver;

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		// Make adapter instance global
		_.adapter = this;

		this.setState("info.connection", false, true);
		this.driver = new Driver(this.config.serialport);
		this.driver.once("driver ready", () => {
			this.setState("info.connection", true, true);

			this.log.info(
				`The driver is ready. Found ${
					this.driver.controller.nodes.size
				} nodes.`,
			);
			this.driver.controller.nodes.forEach(
				this.addNodeEventHandlers.bind(this),
			);
		});
		await this.driver.start();
	}

	private addNodeEventHandlers(node: ZWaveNode): void {
		node.once(
			"interview completed",
			this.onNodeInterviewCompleted.bind(this),
		)
			.on("wake up", this.onNodeWakeUp.bind(this))
			.on("sleep", this.onNodeSleep.bind(this))
			.on("alive", this.onNodeAlive.bind(this))
			.on("dead", this.onNodeDead.bind(this))
			.on("value added", this.onNodeValueAdded.bind(this))
			.on("value updated", this.onNodeValueUpdated.bind(this))
			.on("value removed", this.onNodeValueRemoved.bind(this));
	}

	private onNodeInterviewCompleted(node: ZWaveNode): void {
		this.log.info(`Node ${node.id}: interview completed`);
	}

	private onNodeWakeUp(node: ZWaveNode): void {
		this.log.info(`Node ${node.id}: is now awake`);
	}

	private onNodeSleep(node: ZWaveNode): void {
		this.log.info(`Node ${node.id}: is now asleep`);
	}

	private onNodeAlive(node: ZWaveNode): void {
		this.log.info(`Node ${node.id}: has returned from the dead`);
	}

	private onNodeDead(node: ZWaveNode): void {
		this.log.info(`Node ${node.id}: is now dead`);
	}

	private async onNodeValueAdded(
		node: ZWaveNode,
		args: ZWaveNodeValueAddedArgs,
	): Promise<void> {
		this.log.info(
			`Node ${node.id}: value added: ${args.propertyName} => ${
				args.newValue
			}`,
		);
		await extendValue(node.id, args);
	}

	private async onNodeValueUpdated(
		node: ZWaveNode,
		args: ZWaveNodeValueUpdatedArgs,
	): Promise<void> {
		this.log.info(
			`Node ${node.id}: value updated: ${args.propertyName} => ${
				args.newValue
			}`,
		);
		await extendValue(node.id, args);
	}

	private async onNodeValueRemoved(
		node: ZWaveNode,
		args: ZWaveNodeValueRemovedArgs,
	): Promise<void> {
		this.log.info(`Node ${node.id}: value removed: ${args.propertyName}`);
		await removeValue(node.id, args);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private async onUnload(callback: () => void): Promise<void> {
		try {
			this.log.info("Shutting down driver...");
			await this.driver.destroy();
			this.log.info("Cleaned everything up!");
			callback();
		} catch (e) {
			callback();
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
	private onStateChange(
		id: string,
		state: ioBroker.State | null | undefined,
	): void {
		if (state) {
			// The state was changed
			this.log.debug(
				`state ${id} changed: ${state.val} (ack = ${state.ack})`,
			);
		} else {
			// The state was deleted
			this.log.debug(`state ${id} deleted`);
		}
	}

	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.message" property to be set to true in io-package.json
	//  */
	// private onMessage(obj: ioBroker.Message): void {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }
}

if (module.parent) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<ioBroker.AdapterOptions> | undefined) =>
		new Zwave2(options);
} else {
	// otherwise start the instance directly
	(() => new Zwave2())();
}
