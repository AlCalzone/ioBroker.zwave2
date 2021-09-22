import { actuatorCCs, valueIdToString, ValueMetadata } from "@zwave-js/core";
import type { TranslatedValueID, VirtualNode } from "zwave-js";

export interface VirtualValueID extends TranslatedValueID {
	metadata: ValueMetadata;
	ccVersion: number;
}

export function getVirtualValueIDs(node: VirtualNode): VirtualValueID[] {
	// In order to compare value ids, we need them to be strings
	const ret = new Map<string, VirtualValueID>();

	for (const pNode of node.physicalNodes) {
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

	return [...ret.values()];
}
