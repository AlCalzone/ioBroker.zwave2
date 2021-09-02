import type { Connection } from "@iobroker/socket-client";
import { useConnection, useGlobals } from "iobroker-react/hooks";
import React from "react";
import type {
	AssociationAddress,
	AssociationGroup,
	InclusionGrant,
	InclusionStrategy,
	RFRegion,
} from "zwave-js";
import {
	AssociationDefinition,
	computeDeviceId,
	FirmwareUpdatePollResponse,
	NetworkHealPollResponse,
	PushMessage,
} from "../../../src/lib/shared";

export interface Device {
	id: string;
	value: ioBroker.DeviceObject;
	status?: "unknown" | "alive" | "asleep" | "awake" | "dead";
	ready?: boolean;
	endpoints?: Map<number, Endpoint>;
}

export interface Endpoint {
	associationGroups?: Record<number, AssociationGroup>;
	associations?: Record<number, AssociationAddress[]>;
}

export type SendToResult<T extends any = any> =
	| {
			error: string | Error;
			result?: undefined;
	  }
	| {
			error?: undefined;
			result: T;
	  };

export interface NodeInfo {
	id: number;
	name: string;
	neighbors: number[];
}

export class API {
	public constructor(
		private readonly namespace: string,
		private readonly connection: Connection,
	) {}

	public async beginHealingNetwork(): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"beginHealingNetwork",
		);
		if (result !== "ok") {
			throw error ?? result;
		}
	}

	public async stopHealingNetwork(): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"stopHealingNetwork",
		);
		if (result !== "ok") {
			throw error ?? result;
		}
	}

	public async pollHealingStatus(): Promise<NetworkHealPollResponse> {
		const { error, result } = await this.connection.sendTo<
			SendToResult<NetworkHealPollResponse>
		>(this.namespace, "healNetworkPoll");
		if (error) throw error;
		return result!;
	}

	public async registerPushCallback(
		clearPending: boolean,
	): Promise<PushMessage[]> {
		const { error, result } = await this.connection.sendTo<
			SendToResult<PushMessage[]>
		>(this.namespace, "registerPushCallback", { clearPending });
		if (error) throw error;
		return result!;
	}

	public async beginInclusion(
		strategy: InclusionStrategy,
		forceSecurity?: boolean,
	): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"beginInclusion",
			{ strategy, forceSecurity },
		);
		if (result !== "ok") {
			throw error ?? result;
		}
	}

	public async validateDSK(pin: string | false): Promise<void> {
		const { error } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"validateDSK",
			{ pin },
		);
		if (error) throw error;
	}

	public async grantSecurityClasses(
		grant: InclusionGrant | false,
	): Promise<void> {
		const { error } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"grantSecurityClasses",
			{ grant },
		);
		if (error) throw error;
	}

	public async stopInclusion(): Promise<boolean> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"stopInclusion",
		);
		if (error) throw error;
		return result === "ok";
	}

	public async softReset(): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"softReset",
		);
		if (result !== "ok") {
			throw error ?? result;
		}
	}

	public async hardReset(): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"hardReset",
		);
		if (result !== "ok") {
			throw error ?? result;
		}
	}

	public async clearCache(): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"clearCache",
		);
		if (result !== "ok") {
			throw error ?? result;
		}
	}

	public async removeFailedNode(nodeId: number): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"removeFailedNode",
			{ nodeId },
		);
		if (result !== "ok") {
			throw error ?? result;
		}
	}

	public async refreshNodeInfo(nodeId: number): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"refreshNodeInfo",
			{ nodeId },
		);
		if (result !== "ok") {
			throw error ?? result;
		}
	}

	public async getEndpointIndizes(
		nodeId: number,
	): Promise<readonly number[]> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"getEndpointIndizes",
			{ nodeId },
		);
		if (error) throw error;
		return result;
	}

	public async getAssociationGroups(
		source: AssociationAddress,
	): Promise<Endpoint["associationGroups"]> {
		const { result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"getAssociationGroups",
			{ source },
		);
		// Some nodes don't support associations, ignore them
		return result;
	}

	public async getAssociations(
		source: AssociationAddress,
	): Promise<Endpoint["associations"]> {
		const { result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"getAssociations",
			{ source },
		);
		// Some nodes don't support associations, ignore them
		return result;
	}

	public async addAssociation(
		nodeId: number,
		association: AssociationDefinition,
	): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"addAssociation",
			{ nodeId, association },
		);
		if (error) throw error;
		return result;
	}

	public async removeAssociation(
		nodeId: number,
		association: AssociationDefinition,
	): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"removeAssociation",
			{ nodeId, association },
		);
		if (error) throw error;
		return result;
	}

	public async getNodeStatus(
		nodeId: number,
	): Promise<Device["status"] | undefined> {
		return ((
			await this.connection.getState(
				`${this.namespace}.${computeDeviceId(nodeId)}.status`,
			)
		)?.val ?? undefined) as Device["status"];
	}

	public async getNodeReady(nodeId: number): Promise<boolean> {
		return ((
			await this.connection.getState(
				`${this.namespace}.${computeDeviceId(nodeId)}.ready`,
			)
		)?.val ?? false) as boolean;
	}

	public async updateConfig(): Promise<boolean> {
		const { result, error } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"updateConfig",
		);
		if (error) throw error;
		return result;
	}

	public async updateEndpointsAndAssociations(
		nodeId: number,
		device: Device,
	): Promise<void> {
		const endpointIndizes = [0];
		endpointIndizes.push(...(await this.getEndpointIndizes(nodeId)));
		const endpoints = new Map<number, Endpoint>();
		for (const i of endpointIndizes) {
			endpoints.set(i, {
				associationGroups: await this.getAssociationGroups({
					nodeId,
					endpoint: i,
				}),
				associations: await this.getAssociations({
					nodeId,
					endpoint: i,
				}),
			});
		}
		device.endpoints = endpoints;
	}

	public async loadDevices(
		options: {
			status?: boolean;
			ready?: boolean;
			associations?: boolean;
		} = {},
	): Promise<Record<number, Device>> {
		const ret: Record<number, Device> = {};
		const devices = await this.connection.getObjectView(
			this.namespace + ".",
			this.namespace + ".\u9999",
			"device",
		);
		for (const _device of Object.values(devices)) {
			const device: Device = { id: _device._id, value: _device };
			const nodeId = _device.native.id as number;
			if (options.ready) {
				device.ready = await this.getNodeReady(nodeId);
			}
			if (options.status) {
				device.status = await this.getNodeStatus(nodeId);
			}
			if (options.associations && device.ready) {
				await this.updateEndpointsAndAssociations(nodeId, device);
			}
			ret[nodeId] = device;
		}
		return ret;
	}

	public async beginFirmwareUpdate(
		nodeId: number,
		filename: string,
		firmware: number[],
	): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"beginFirmwareUpdate",
			{ nodeId, filename, firmware },
		);
		if (result !== "ok") {
			throw error ?? result;
		}
	}

	public async pollFirmwareUpdateStatus(
		nodeId: number,
	): Promise<FirmwareUpdatePollResponse> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"firmwareUpdatePoll",
			{ nodeId },
		);
		if (error) throw error;
		return result;
	}

	public async abortFirmwareUpdate(nodeId: number): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"abortFirmwareUpdate",
			{ nodeId },
		);
		if (result !== "ok") {
			throw error ?? result;
		}
	}

	public async getNetworkMap(): Promise<NodeInfo[]> {
		const { error, result } = await this.connection.sendTo<
			SendToResult<NodeInfo[]>
		>(this.namespace, "getNetworkMap");
		if (error) throw error;
		return result ?? [];
	}

	public async listSerialPorts(): Promise<string[]> {
		const { error, result } = await this.connection.sendTo<
			SendToResult<string[]>
		>(this.namespace, "getSerialPorts");
		if (error) throw error;
		return result ?? [];
	}

	public async setRFRegion(region: RFRegion): Promise<void> {
		const { error, result } = await this.connection.sendTo<SendToResult>(
			this.namespace,
			"setRFRegion",
			{ region },
		);
		if (result !== "ok") {
			throw error ?? result;
		}
	}
}

/** Hook to subscribe to the adapter's `alive` and `connected` states */
export function useAPI(): API {
	const { namespace } = useGlobals();
	const connection = useConnection();
	const api = React.useMemo(
		() => new API(namespace, connection),
		[connection, namespace],
	);
	return api;
}
