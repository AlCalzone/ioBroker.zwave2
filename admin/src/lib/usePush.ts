import { isArray } from "alcalzone-shared/typeguards";
import React from "react";
import type { PushMessage } from "../../../src/lib/shared";
import { useAPI } from "./useAPI";

/** Hook to handle push functionality from the backend */
export function usePush(onPush: (payload: PushMessage) => void): void {
	const api = useAPI();

	React.useEffect(() => {
		let firstTime = true;
		let cancel = false;
		(async () => {
			while (!cancel) {
				try {
					// Fetch pending push messages
					const payloads = await api.registerPushCallback(firstTime);
					firstTime = false;

					// And call the push callback for each one of them
					if (isArray(payloads)) payloads.forEach((p) => onPush(p));
				} catch (e) {
					console.error(`Getting push messages failed: ${e}`);
				}
			}
		})();

		return () => {
			cancel = true;
		};
	}, [api, onPush]);
}
