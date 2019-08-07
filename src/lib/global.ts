export class Global {
	private static _adapter: ioBroker.Adapter;
	public static get adapter(): ioBroker.Adapter {
		return Global._adapter;
	}
	public static set adapter(adapter: ioBroker.Adapter) {
		Global._adapter = adapter;
	}
}
