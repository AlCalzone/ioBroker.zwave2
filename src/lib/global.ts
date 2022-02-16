import type { AdapterInstance } from "@iobroker/adapter-core";
import { filter as objFilter } from "alcalzone-shared/objects";

export class Global {
	private static _adapter: AdapterInstance<true, any>;
	public static get adapter(): AdapterInstance<true, any> {
		return Global._adapter;
	}
	public static set adapter(adapter: AdapterInstance<true, any>) {
		Global._adapter = adapter;
	}

	/**
	 * Kurzschreibweise für die Ermittlung mehrerer Objekte
	 * @param id
	 */
	public static async $$(
		pattern: string,
		options: {
			type?: ioBroker.ObjectType;
			role?: string;
		} = {},
	): Promise<Record<string, ioBroker.Object>> {
		const { type, role } = options;
		const objects = await Global._adapter.getForeignObjectsAsync(
			pattern,
			type,
		);
		if (role) {
			return objFilter(objects, (o) => (o.common as any).role === role);
		} else {
			return objects;
		}
	}
}
