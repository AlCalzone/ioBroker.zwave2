import * as React from "react";
import {
	getStateAsync,
	setStateAsync,
	subscribeStatesAsync,
	unsubscribeStatesAsync,
} from "./backend";

export interface UseIoBrokerStateOptions<
	T extends ioBroker.State["val"] = ioBroker.State["val"]
> {
	/** The default value that is used until the actual value has been retrieved */
	defaultValue?: T | undefined;
	/** Whether to subscribe to the state ID */
	subscribe?: boolean;
	/** Transforms the received values */
	transform?: (val: any) => T | undefined;
}

/**
 * Links a React state to a state in ioBroker and returns a way to set the value in the backend.
 * @param stateId The state id to access
 */
export function useIoBrokerState<
	// wotan-disable-next-line no-misused-generics
	T extends ioBroker.State["val"] = ioBroker.State["val"]
>(
	stateId: string,
	options?: UseIoBrokerStateOptions<T> = {},
): readonly [
	T | undefined,
	(value: Parameters<ioBroker.Adapter["setStateAsync"]>[1]) => Promise<void>,
] {
	const { subscribe = true, defaultValue, transform } = options;

	const [value, setValue] = React.useState<T | undefined>(defaultValue);

	const onStateChange: ioBroker.StateChangeHandler = (id, state) => {
		if (state && state.ack && id === stateId) {
			const value = state?.val as T;
			setValue(transform ? transform(value) : value);
		}
	};

	React.useEffect(() => {
		(async () => {
			// Load value initially
			if (subscribe) await subscribeStatesAsync(stateId);
			const initialValue = (await getStateAsync(stateId))?.val as T;
			setValue(transform ? transform(initialValue) : initialValue);

			// And update it on changes
			socket.on("stateChange", onStateChange);
		})();

		// componentWillUnmount
		return () => {
			socket.removeEventHandler("stateChange", onStateChange);
			if (subscribe) unsubscribeStatesAsync(stateId);
		};
	}, []);

	return [value, (newValue) => setStateAsync(stateId, newValue)] as const;
}
