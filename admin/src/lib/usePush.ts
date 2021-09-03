import React from "react";
import { PushCallback, useAPI } from "./useAPI";

/** Hook to handle push functionality from the backend */
export function usePush(onPush: PushCallback): void {
	const api = useAPI();

	React.useEffect(() => {
		api.addPushCallback(onPush);

		return () => {
			api.removePushCallback(onPush);
		};
	}, [api, onPush]);
}
