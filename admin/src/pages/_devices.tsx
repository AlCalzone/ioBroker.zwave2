import React from "react";
import {
	InclusionMode,
	NetworkHealPollResponse,
} from "../../../src/lib/shared";
import { useDevices } from "../lib/useDevices";
import { NotRunning } from "../components/_messages";
import {
	useIoBrokerState,
	useAdapter,
	useGlobals,
	useI18n,
	useDialogs,
} from "iobroker-react/hooks";
import {
	DeviceActionButtons,
	DeviceActionButtonsState,
} from "../components/DeviceActionButtons";
import { Device, useAPI } from "../lib/useAPI";
import { DeviceTable } from "../components/DeviceTable";

export const Devices: React.FC = () => {
	const [devices] = useDevices();
	const { alive: adapterRunning, connected: driverReady } = useAdapter();
	const { namespace } = useGlobals();
	const { translate: _ } = useI18n();
	const api = useAPI();

	const [inclusion, , setInclusion] = useIoBrokerState<InclusionMode>({
		id: `${namespace}.info.inclusion`,
		defaultValue: InclusionMode.Idle,
		transform: (value) => (value === false ? InclusionMode.Idle : value),
	});
	const [exclusion, , setExclusion] = useIoBrokerState<boolean>({
		id: `${namespace}.info.exclusion`,
		defaultValue: false,
	});
	const [healingNetwork] = useIoBrokerState<boolean>({
		id: `${namespace}.info.healingNetwork`,
		defaultValue: false,
	});

	const { showNotification, showModal } = useDialogs();

	const [networkHealProgress, setNetworkHealProgress] = React.useState<
		NonNullable<NetworkHealPollResponse["progress"]>
	>({});
	const [cacheCleared, setCacheCleared] = React.useState(false);

	async function healNetwork() {
		if (!healingNetwork) {
			// start the healing progress
			try {
				setNetworkHealProgress({});
				await api.beginHealingNetwork();
			} catch (e) {
				showNotification(e.message, "error");
				return;
			}
		}
	}

	async function clearCache() {
		if (
			!healingNetwork &&
			inclusion === InclusionMode.Idle &&
			!exclusion &&
			!cacheCleared
		) {
			// start the healing progress
			try {
				const result = await showModal(
					_("Clear cache?"),
					_("clear cache procedure"),
				);
				if (!result) return;
				await api.clearCache();
				setCacheCleared(true);
			} catch (e) {
				showNotification(e.message, "error");
				return;
			}
		}
	}

	// Poll the healing progress while we're healing
	const [isPolling, setIsPolling] = React.useState(false);
	React.useEffect(() => {
		(async () => {
			if (healingNetwork && !isPolling) {
				console.log("isPolling: true");
				setIsPolling(true);
				try {
					const result = await api.pollHealingStatus();
					console.log(`poll result: ${JSON.stringify(result)}`);
					setNetworkHealProgress(result.progress ?? {});
					if (result.type === "done") {
						void showNotification(
							_("Healing the network was successful!"),
							"success",
						);
					} else {
						// Kick off the next poll
						setIsPolling(false);
					}
				} catch (e) {
					console.error(`Error while polling: ${e}`);
					// Kick off the next poll
					setIsPolling(false);
				}
			}
		})();
	}, [isPolling, healingNetwork]);

	const devicesAsArray: Device[] = [];
	if (devices) {
		for (const nodeId of Object.keys(devices)) {
			const device = devices[nodeId];
			if (device) devicesAsArray.push(device);
		}
	}

	return adapterRunning && driverReady ? (
		<>
			{/* Action buttons */}
			<DeviceActionButtons
				state={
					inclusion
						? DeviceActionButtonsState.Including
						: exclusion
						? DeviceActionButtonsState.Excluding
						: healingNetwork
						? DeviceActionButtonsState.Healing
						: DeviceActionButtonsState.Idle
				}
				// TODO: This should be true/false and the strategy handled in the dialog
				beginInclusion={() => setInclusion(InclusionMode.Secure)}
				cancelInclusion={() => setInclusion(InclusionMode.Idle)}
				beginExclusion={() => setExclusion(true)}
				cancelExclusion={() => setExclusion(false)}
				healNetwork={healNetwork}
				cancelHealing={() => api.stopHealingNetwork()}
				clearCache={clearCache}
			/>

			<DeviceTable
				devices={devicesAsArray}
				healingNetwork={healingNetwork}
				networkHealProgress={networkHealProgress}
			/>
		</>
	) : (
		<NotRunning />
	);
};
