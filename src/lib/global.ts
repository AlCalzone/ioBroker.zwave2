import { filter as objFilter } from "alcalzone-shared/objects";

export class Global {
	private static _adapter: ioBroker.Adapter;
	public static get adapter(): ioBroker.Adapter {
		return Global._adapter;
	}
	public static set adapter(adapter: ioBroker.Adapter) {
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
			return objFilter(objects, o => (o.common as any).role === role);
		} else {
			return objects;
		}
	}
}
