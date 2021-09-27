import {
	actuatorCCs,
	CommandClasses,
	valueIdToString,
	ValueMetadata,
	ValueMetadataNumeric,
} from "@zwave-js/core";
import { distinct } from "alcalzone-shared/arrays";
import type { TranslatedValueID, VirtualNode } from "zwave-js";

export interface VirtualValueID extends TranslatedValueID {
	metadata: ValueMetadata;
	ccVersion: number;
}

export function getVirtualValueIDs(node: VirtualNode): VirtualValueID[] {
	// If all nodes are secure, we can't use broadcast commands
	if (node.physicalNodes.every((n) => n.isSecure === true)) return [];

	// In order to compare value ids, we need them to be strings
	const ret = new Map<string, VirtualValueID>();

	for (const pNode of node.physicalNodes) {
		// Secure nodes cannot be used for broadcast
		if (pNode.isSecure === true) continue;

		// Take only the actuator values
		const valueIDs: TranslatedValueID[] = pNode
			.getDefinedValueIDs()
			.filter((v) => actuatorCCs.includes(v.commandClass));
		// And add them to the returned array if they aren't included yet or if the version is higher

		for (const valueId of valueIDs) {
			const mapKey = valueIdToString(valueId);
			const ccVersion = pNode.getCCVersion(valueId.commandClass);
			const metadata = pNode.getValueMetadata(valueId);
			// Don't expose read-only values for virtual nodes, they won't ever have any value
			if (!metadata.writeable) continue;

			const needsUpdate =
				!ret.has(mapKey) || ret.get(mapKey)!.ccVersion < ccVersion;
			if (needsUpdate) {
				ret.set(mapKey, {
					...valueId,
					ccVersion,
					metadata: pNode.getValueMetadata(valueId),
				});
			}
		}
	}

	// Basic CC is not exposed, but virtual nodes need it to control multiple different devices together
	const exposedEndpoints = distinct(
		[...ret.values()]
			.map((v) => v.endpoint)
			.filter((e): e is number => e !== undefined),
	);
	for (const endpoint of exposedEndpoints) {
		const valueId: TranslatedValueID = {
			commandClass: CommandClasses.Basic,
			commandClassName: "Basic",
			endpoint,
			property: "targetValue",
			propertyName: "Target value",
		};
		const ccVersion = 1;
		const metadata: ValueMetadataNumeric = {
			...ValueMetadata.WriteOnlyUInt8,
			label: "Target value",
		};
		ret.set(valueIdToString(valueId), {
			...valueId,
			ccVersion,
			metadata,
		});
	}

	return [...ret.values()];
}
