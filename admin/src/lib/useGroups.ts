import { isArray } from "alcalzone-shared/typeguards";
import { useConnection, useGlobals } from "iobroker-react/hooks";
import { useCallback, useEffect, useState } from "react";

export type GroupObject = ioBroker.DeviceObject & {
	native: ioBroker.DeviceObject["native"] & {
		nodeIds: number[];
	};
};

const groupIdRegex = /\.Group_([^\.]+)$/;

function isGroupObject(obj: ioBroker.Object): obj is GroupObject {
	if (obj.type !== "device") return false;
	if (!isArray(obj.native.nodeIds)) return false;
	return obj.native.nodeIds.every((n) => typeof n === "number");
}

function sanitizeName(name: string): string {
	return name.replace(/[ .:,;µ<>|!"§$%&\\/()=?#+'~*]+/gi, "_");
}

export function nameFromGroupObject(obj: GroupObject): string {
	if (typeof obj.common.name === "string" && !!obj.common.name) {
		return obj.common.name;
	} else {
		return obj._id.match(groupIdRegex)![1];
	}
}

export function useGroups(): Readonly<{
	// id -> object
	groups: Record<string, GroupObject> | undefined;
	saveGroup: (
		name: string,
		nodeIds: number[],
		objectId?: string,
	) => Promise<void>;
	deleteGroup: (obj: GroupObject) => Promise<void>;
}> {
	const connection = useConnection();
	const [groups, setGroups] = useState<Record<string, GroupObject>>();
	const { namespace } = useGlobals();

	const onObjectChange: ioBroker.ObjectChangeHandler = async (id, obj) => {
		if (!id.startsWith(namespace) || !groupIdRegex.test(id)) return;
		if (obj) {
			// New or changed group object
			if (isGroupObject(obj)) {
				setGroups((groups) => ({ ...groups, [id]: obj }));
			}
		} else {
			setGroups((groups) => {
				const newGroups = { ...groups };
				delete newGroups[id];
				return newGroups;
			});
		}
	};

	async function loadGroups(): Promise<void> {
		const groupObjects = await connection.getObjectView(
			`${namespace}.Group_`,
			`${namespace}.Group_\u9999`,
			"device",
		);
		const groups: Record<string, GroupObject> = {};
		for (const [id, obj] of Object.entries<ioBroker.Object>(groupObjects)) {
			if (
				!id.startsWith(namespace) ||
				!groupIdRegex.test(id) ||
				!isGroupObject(obj)
			) {
				continue;
			}

			groups[id] = obj;
		}

		setGroups(groups);
	}

	const saveGroup = useCallback(
		async (
			name: string,
			nodeIds: number[],
			objectId?: string,
		): Promise<void> => {
			// Reuse the old name for the ID when renaming a group
			const id = objectId ?? `${namespace}.Group_${sanitizeName(name)}`;
			await connection.setObject(id, {
				type: "device",
				common: { name },
				native: { multicast: true, nodeIds },
			});
		},
		[namespace, connection],
	);

	const deleteGroup = useCallback(
		async (obj: GroupObject): Promise<void> => {
			await connection.delObject(obj._id);
		},
		[connection],
	);

	useEffect(() => {
		(async () => {
			// Load groups initially
			await loadGroups();

			// And update them on changes - these patterns are a bit broad, but we're going to reuse them anyways
			connection.subscribeObject(`${namespace}.Group_*`, onObjectChange);
		})();

		// componentWillUnmount
		return () => {
			connection.unsubscribeObject(
				`${namespace}.Group_*`,
				onObjectChange,
			);
		};
	}, []);

	return { groups, saveGroup, deleteGroup } as const;
}
