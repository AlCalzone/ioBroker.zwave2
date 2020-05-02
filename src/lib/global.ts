import { filter as objFilter } from "alcalzone-shared/objects";
import type { ZWave2 } from "../main";

export class Global {
	private static _adapter: ZWave2;
	public static get adapter(): ZWave2 {
		return Global._adapter;
	}
	public static set adapter(adapter: ZWave2) {
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
