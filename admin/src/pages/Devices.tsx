import React from "react";
import {
	getErrorMessage,
	InclusionStatus,
	NetworkHealStatus,
} from "../../../src/lib/shared";
import { useDevices } from "../lib/useDevices";
import { NotRunning } from "../components/Messages";
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
import {
	InclusionDialog,
	InclusionDialogProps,
	InclusionStep,
} from "../components/InclusionDialog";
import { usePush } from "../lib/usePush";

// interface Inclusion

export const Devices: React.FC = () => {
	const [devices] = useDevices();
	const { alive: adapterRunning, connected: driverReady } = useAdapter();
	const { namespace } = useGlobals();
	const { translate: _ } = useI18n();
	const api = useAPI();
	const { showNotification } = useDialogs();
	const [isBusy, setBusy] = React.useState(false);

	const [inclusion] = useIoBrokerState<boolean>({
		id: `${namespace}.info.inclusion`,
		defaultValue: false,
	});
	const [exclusion, , setExclusion] = useIoBrokerState<boolean>({
		id: `${namespace}.info.exclusion`,
		defaultValue: false,
	});
	const [healingNetwork] = useIoBrokerState<boolean>({
		id: `${namespace}.info.healingNetwork`,
		defaultValue: false,
	});

	const [networkHealProgress, setNetworkHealProgress] = React.useState<
		NonNullable<NetworkHealStatus["progress"]>
	>({});

	const [inclusionStatus, setInclusionStatus] =
		React.useState<InclusionStatus>();

	usePush((payload) => {
		if (payload.type === "inclusion") {
			setInclusionStatus(payload.status);
		} else if (payload.type === "healing") {
			setNetworkHealProgress(payload.status.progress ?? {});
			if (payload.status.type === "done") {
				void showNotification(
					_("Healing the network was successful!"),
					"success",
				);
			}
		}
	});

	async function healNetwork() {
		if (!healingNetwork) {
			// start the healing progress
			try {
				setNetworkHealProgress({});
				await api.beginHealingNetwork();
			} catch (e) {
				showNotification(getErrorMessage(e), "error");
				return;
			}
		}
	}

	const [showInclusionModal, setShowInclusionModal] = React.useState(false);

	const devicesAsArray: Device[] = [];
	if (devices) {
		for (const nodeId of Object.keys(devices)) {
			const device = devices[nodeId];
			if (device) devicesAsArray.push(device);
		}
	}

	// Choose which inclusion step to display
	const inclusionDialogProps = ((): InclusionDialogProps | undefined => {
		if (!inclusionStatus && !inclusion) {
			return {
				step: InclusionStep.SelectStrategy,
				onCancel: () => setShowInclusionModal(false),
				selectStrategy: async (strategy, forceSecurity) => {
					try {
						await api.beginInclusion(strategy, forceSecurity);
						setInclusionStatus({
							type: "waitingForDevice",
						});
					} catch {
						showNotification(
							_("Failed to start inclusion"),
							"error",
						);
					}
				},
			};
		} else if (
			!inclusionStatus ||
			inclusionStatus.type === "waitingForDevice"
		) {
			return {
				step: InclusionStep.IncludeDevice,
				onCancel: () => {
					setShowInclusionModal(false);
					api.stopInclusion();
				},
			};
		} else if (inclusionStatus.type === "busy") {
			return {
				step: InclusionStep.Busy,
				onCancel: () => {
					// Don't do anything here
				},
			};
		} else if (inclusionStatus.type === "validateDSK") {
			return {
				step: InclusionStep.ValidateDSK,
				dsk: inclusionStatus.dsk,
				setPIN: (pin) => {
					api.validateDSK(pin);
				},
				onCancel: () => {
					api.validateDSK(false);
				},
			};
		} else if (inclusionStatus.type === "grantSecurityClasses") {
			return {
				step: InclusionStep.GrantSecurityClasses,
				request: inclusionStatus.request,
				grantSecurityClasses: (grant) => {
					api.grantSecurityClasses(grant);
				},
				onCancel: () => {
					api.grantSecurityClasses(false);
				},
			};
		} else if (inclusionStatus.type === "done") {
			return {
				step: InclusionStep.Result,
				nodeId: inclusionStatus.nodeId,
				lowSecurity: inclusionStatus.lowSecurity,
				securityClass: inclusionStatus.securityClass,
				onDone: () => {
					setShowInclusionModal(false);
					// avoid flicker while the modal is being hidden
					setTimeout(() => {
						setInclusionStatus(undefined);
					}, 250);
				},
				onCancel: () => {
					setShowInclusionModal(false);
					// avoid flicker while the modal is being hidden
					setTimeout(() => {
						setInclusionStatus(undefined);
					}, 250);
				},
			};
		}
	})();

	return adapterRunning && driverReady ? (
		<>
			{/* Action buttons */}
			<DeviceActionButtons
				state={
					isBusy
						? DeviceActionButtonsState.Busy
						: inclusion || inclusionStatus
						? DeviceActionButtonsState.Including
						: exclusion
						? DeviceActionButtonsState.Excluding
						: healingNetwork
						? DeviceActionButtonsState.Healing
						: DeviceActionButtonsState.Idle
				}
				beginInclusion={() => setShowInclusionModal(true)}
				beginExclusion={() => setExclusion(true)}
				cancelExclusion={() => setExclusion(false)}
				healNetwork={healNetwork}
				cancelHealing={() => api.stopHealingNetwork()}
			/>

			<DeviceTable
				isBusy={isBusy || healingNetwork}
				setBusy={setBusy}
				devices={devicesAsArray}
				healingNetwork={healingNetwork}
				networkHealProgress={networkHealProgress}
			/>

			{/* Modal dialog for the inclusion process */}
			{inclusionDialogProps && (
				<InclusionDialog
					isOpen={showInclusionModal}
					{...inclusionDialogProps}
				/>
			)}
		</>
	) : (
		<NotRunning />
	);
};
