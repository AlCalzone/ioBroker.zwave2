declare namespace ioBroker {
	interface AdapterConfig {
		serialport: string;
		writeLogFile: boolean;
		clearCache: boolean;
		networkKey: string;
		driver_increaseTimeouts: boolean;
		driver_increaseSendAttempts: boolean;
		switchCompat: boolean;
	}
}
