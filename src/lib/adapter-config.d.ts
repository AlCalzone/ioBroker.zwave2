declare namespace ioBroker {
	interface AdapterConfig {
		serialport: string;
		writeLogFile: boolean;
		clearCache: boolean;
		networkKey?: string;
		networkKey_S0: string;
		networkKey_S2_AccessControl: string;
		networkKey_S2_Authenticated: string;
		networkKey_S2_Unauthenticated: string;
		driver_increaseTimeouts: boolean;
		driver_increaseSendAttempts: boolean;
		switchCompat: boolean;
		preserveStateNames: boolean;
		notificationEventValidity: number;
	}
}
