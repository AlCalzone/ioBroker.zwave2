import React from "react";
import {
	getErrorMessage,
	InclusionExclusionStatus,
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
	InclusionExclusionDialogProps,
	InclusionExclusionStep,
} from "../components/InclusionExclusionDialog";
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
		React.useState<InclusionExclusionStatus>();

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

	const [showInclusionExclusionModal, setShowInclusionExclusionModal] =
		React.useState(false);

	const devicesAsArray: Device[] = [];
	if (devices) {
		for (const nodeId of Object.keys(devices)) {
			const device = devices[nodeId];
			if (device) devicesAsArray.push(device);
		}
	}

	async function replaceFailedNode(nodeId: number) {
		setInclusionStatus({
			type: "chooseReplacementStrategy",
			nodeId,
		});
		setShowInclusionExclusionModal(true);
	}

	// Choose which inclusion/exclusion step to display
	const inclusionExclusionDialogProps = (():
		| InclusionExclusionDialogProps
		| undefined => {
		if (exclusion) {
			return {
				step: InclusionExclusionStep.ExcludeDevice,
				onCancel: () => {
					setShowInclusionExclusionModal(false);
					// avoid flicker while the modal is being hidden
					setTimeout(() => {
						setExclusion(false);
					}, 250);
				},
			};
		} else if (!inclusionStatus && !inclusion) {
			return {
				step: InclusionExclusionStep.SelectInclusionStrategy,
				onCancel: () => setShowInclusionExclusionModal(false),
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
		} else if (inclusionStatus?.type === "chooseReplacementStrategy") {
			return {
				step: InclusionExclusionStep.SelectReplacementStrategy,
				onCancel: () => {
					setShowInclusionExclusionModal(false);
					// avoid flicker while the modal is being hidden
					setTimeout(() => {
						setInclusionStatus(undefined);
					}, 250);
				},
				selectStrategy: async (strategy) => {
					try {
						await api.replaceFailedNode(
							inclusionStatus.nodeId,
							strategy,
						);
						setInclusionStatus({
							type: "waitingForDevice",
						});
					} catch {
						showNotification(
							_("Failed to start replacing the node"),
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
				step: InclusionExclusionStep.IncludeDevice,
				onCancel: () => {
					setShowInclusionExclusionModal(false);
					api.stopInclusion();
				},
			};
		} else if (inclusionStatus.type === "busy") {
			return {
				step: InclusionExclusionStep.Busy,
				onCancel: () => {
					// Don't do anything here
				},
			};
		} else if (inclusionStatus.type === "validateDSK") {
			return {
				step: InclusionExclusionStep.ValidateDSK,
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
				step: InclusionExclusionStep.GrantSecurityClasses,
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
				step: InclusionExclusionStep.Result,
				nodeId: inclusionStatus.nodeId,
				lowSecurity: inclusionStatus.lowSecurity,
				securityClass: inclusionStatus.securityClass,
				onDone: () => {
					setShowInclusionExclusionModal(false);
					// avoid flicker while the modal is being hidden
					setTimeout(() => {
						setInclusionStatus(undefined);
					}, 250);
				},
				onCancel: () => {
					setShowInclusionExclusionModal(false);
					// avoid flicker while the modal is being hidden
					setTimeout(() => {
						setInclusionStatus(undefined);
					}, 250);
				},
			};
		} else if (inclusionStatus.type === "exclusionDone") {
			return {
				step: InclusionExclusionStep.ExclusionResult,
				nodeId: inclusionStatus.nodeId,
				onDone: () => {
					setShowInclusionExclusionModal(false);
					// avoid flicker while the modal is being hidden
					setTimeout(() => {
						setInclusionStatus(undefined);
					}, 250);
				},
				onCancel: () => {
					setShowInclusionExclusionModal(false);
					// avoid flicker while the modal is being hidden
					setTimeout(() => {
						setInclusionStatus(undefined);
					}, 250);
				},
			};
		}
	})();

	const isIncluding =
		inclusion ||
		(!!inclusionStatus &&
			!exclusion &&
			inclusionStatus.type !== "exclusionDone");
	const isExcluding =
		exclusion ||
		(!!inclusionStatus &&
			!inclusion &&
			inclusionStatus.type !== "done" &&
			inclusionStatus.type !== "exclusionDone");

	return adapterRunning && driverReady ? (
		<>
			{/* Action buttons */}
			<DeviceActionButtons
				state={
					isBusy
						? DeviceActionButtonsState.Busy
						: isIncluding
						? DeviceActionButtonsState.Including
						: isExcluding
						? DeviceActionButtonsState.Excluding
						: healingNetwork
						? DeviceActionButtonsState.Healing
						: DeviceActionButtonsState.Idle
				}
				beginInclusion={() => setShowInclusionExclusionModal(true)}
				beginExclusion={async () => {
					await setExclusion(true);
					setShowInclusionExclusionModal(true);
				}}
				healNetwork={healNetwork}
				cancelHealing={() => api.stopHealingNetwork()}
			/>

			<DeviceTable
				isBusy={isBusy || healingNetwork}
				setBusy={setBusy}
				devices={devicesAsArray}
				healingNetwork={healingNetwork}
				networkHealProgress={networkHealProgress}
				replaceFailedNode={replaceFailedNode}
			/>

			{/* Modal dialog for the inclusion process */}
			{inclusionExclusionDialogProps && (
				<InclusionDialog
					isOpen={showInclusionExclusionModal}
					{...inclusionExclusionDialogProps}
				/>
			)}
		</>
	) : (
		<NotRunning />
	);
};
