import CircularProgress from "@material-ui/core/CircularProgress";
import {
	useAdapter,
	useDialogs,
	useGlobals,
	useI18n,
	useIoBrokerState,
} from "iobroker-react/hooks";
import React from "react";
import {
	getErrorMessage,
	InclusionExclusionStatus,
	NetworkHealStatus,
	PushMessage,
} from "../../../src/lib/shared";
import {
	DeviceActionButtons,
	DeviceActionButtonsState,
} from "../components/DeviceActionButtons";
import { DeviceTable } from "../components/DeviceTable";
import {
	InclusionDialog,
	InclusionExclusionDialogProps,
	InclusionExclusionStep,
	InclusionStrategy,
} from "../components/InclusionExclusionDialog";
import { NotRunning } from "../components/Messages";
import { Device, useAPI } from "../lib/useAPI";
import { usePush } from "../lib/usePush";
export interface DevicesProps {
	devices: Record<number, Device> | undefined;
}

export const Devices: React.FC<DevicesProps> = (props) => {
	const { devices } = props;
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
	const [showInclusionExclusionModal, setShowInclusionExclusionModal] =
		React.useState(false);

	const onPush = React.useCallback(
		(payload: PushMessage) => {
			// console.log("on push", payload);
			if (payload.type === "inclusion") {
				setInclusionStatus(payload.status);
				// Always show the inclusion result
				if (payload.status.type === "done") {
					setShowInclusionExclusionModal(true);
				}
			} else if (payload.type === "healing") {
				setNetworkHealProgress(payload.status.progress ?? {});
				if (payload.status.type === "done") {
					void showNotification(
						_("Healing the network was successful!"),
						"success",
					);
				}
			}
		},
		[setInclusionStatus, setNetworkHealProgress, showNotification],
	);
	usePush(onPush);

	// Enable displaying usage statistics while the device tab is open
	const [statisticsSubscribed, setStatisticsSubscribed] =
		React.useState(false);
	React.useEffect(() => {
		if (adapterRunning && driverReady && !statisticsSubscribed) {
			setStatisticsSubscribed(true);
			void api.subscribeStatistics();
		}
		return () => {
			if (statisticsSubscribed) {
				setStatisticsSubscribed(false);
				void api.unsubscribeStatistics();
			}
		};
	}, [adapterRunning, driverReady, statisticsSubscribed]);

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

	const closeDialog = React.useCallback(() => {
		setShowInclusionExclusionModal(false);
		// avoid flicker while the modal is being hidden
		setTimeout(() => {
			setInclusionStatus(undefined);
		}, 250);
	}, [setShowInclusionExclusionModal, setInclusionStatus]);

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
					if (strategy === InclusionStrategy.QRCode) {
						setInclusionStatus({ type: "scanQRCode" });
						return;
					}

					try {
						await api.beginInclusion(
							strategy as any,
							forceSecurity,
						);
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
				onCancel: closeDialog,
				selectStrategy: async (strategy) => {
					try {
						await api.replaceFailedNode(
							inclusionStatus.nodeId,
							strategy as any,
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
		} else if (inclusionStatus?.type === "scanQRCode") {
			return {
				step: InclusionExclusionStep.QRCode,
				onScan: async (code) => {
					setInclusionStatus({ type: "busy" });
					try {
						const result = await api.scanQRCode(code, true);
						if (result.type === "none") {
							showNotification(
								_("This is not a valid Z-Wave QR code"),
								"warning",
							);
							setInclusionStatus({ type: "scanQRCode" });
						} else if (result.type === "SmartStart") {
							setInclusionStatus({
								type: "resultMessage",
								success: true,
								title: _("Added SmartStart device"),
								message: (
									<>
										{_(
											"Successfully added SmartStart device to provisioning list.",
										)}
										<br />
										{_(
											"It will be included automatically when it announces itself.",
										)}
									</>
								),
							});
						} else if (result.type === "S2") {
							setInclusionStatus({
								type: "waitingForDevice",
							});
						} else if (result.type === "included") {
							setInclusionStatus({
								type: "resultMessage",
								success: true,
								title: _("Already included"),
								message: _(
									"The device is already included as Node %s",
									result.nodeId.toString(),
								),
							});
						} else if (result.type === "provisioned") {
							setInclusionStatus({
								type: "resultMessage",
								success: true,
								title: _("Already provisioned"),
								message: _(
									"This node is already on the SmartStart provisioning list",
								),
							});
						}
					} catch (e) {
						closeDialog();
						showNotification(_("Failed to scan QR code"), "error");
					}
				},
				onCancel: closeDialog,
			};
		} else if (
			!inclusionStatus ||
			inclusionStatus.type === "waitingForDevice"
		) {
			return {
				step: InclusionExclusionStep.IncludeDevice,
				onCancel: () => {
					setShowInclusionExclusionModal(false);
					// avoid flicker while the modal is being hidden
					setTimeout(() => {
						api.stopInclusion();
						setInclusionStatus(undefined);
					}, 250);
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
				onDone: closeDialog,
				onCancel: closeDialog,
			};
		} else if (inclusionStatus.type === "exclusionDone") {
			return {
				step: InclusionExclusionStep.ExclusionResult,
				nodeId: inclusionStatus.nodeId,
				onDone: closeDialog,
				onCancel: closeDialog,
			};
		} else if (inclusionStatus.type === "resultMessage") {
			return {
				step: InclusionExclusionStep.ResultMessage,
				message: inclusionStatus.message,
				success: inclusionStatus.success,
				title: inclusionStatus.title,
				onDone: closeDialog,
				onCancel: closeDialog,
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

	if (!adapterRunning || !driverReady) return <NotRunning />;
	if (!devices) return <CircularProgress />;

	return (
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
	);
};
