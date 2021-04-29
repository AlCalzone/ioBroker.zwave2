import * as React from "react";
import type { FirmwareUpdatePollResponse } from "../../../src/lib/shared";

export interface NodeActionsProps {
	nodeId: number;
	status: string | undefined;
	actions: {
		remove: () => Promise<void>;
		refreshInfo: () => Promise<void>;
		updateFirmware?: (filename: string, data: number[]) => Promise<void>;
		pollFirmwareUpdateStatus?: () => Promise<FirmwareUpdatePollResponse>;
		abortFirmwareUpdate?: () => Promise<void>;
	};
	close: () => void;
}

interface LoadedFile {
	name: string;
	data: Uint8Array;
}

export function NodeActions(props: NodeActionsProps) {
	const [isBusy, setBusy] = React.useState(false);
	const [loadedFile, setLoadedFile] = React.useState<LoadedFile>();
	const [firmwareUpdateActive, setFirmwareUpdateActive] = React.useState(
		false,
	);
	const [
		firmwareUpdateStatus,
		setFirmwareUpdateStatus,
	] = React.useState<FirmwareUpdatePollResponse>();
	const [message, setMessage] = React.useState<string>();

	const input = React.useRef<HTMLInputElement>();

	// It can happen that the controller does not react to commands for a failed node,
	// so the status won't change. We need to allow removing the node in this case too,
	// so just forbid removing alive or awake nodes
	const isNodeFailed = props.status !== "alive" && props.status !== "awake";
	const supportsFirmwareUpdate =
		props.actions.updateFirmware &&
		props.actions.pollFirmwareUpdateStatus &&
		props.actions.abortFirmwareUpdate;

	async function removeNode() {
		setBusy(true);
		try {
			await props.actions.remove();
			props.close();
		} catch (e) {
			alert(e);
		} finally {
			setBusy(false);
		}
	}

	async function refreshInfo() {
		setBusy(true);
		try {
			await props.actions.refreshInfo();
			props.close();
		} catch (e) {
			alert(e);
		} finally {
			setBusy(false);
		}
	}

	const loadFirmware = () => {
		input.current?.click();
	};
	const selectFirmware = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) {
			const file = e.target.files[0];
			const data = new Uint8Array(await file.arrayBuffer());
			setLoadedFile({
				name: file.name,
				data,
			});
		}
	};
	async function beginFirmwareUpdate() {
		if (loadedFile?.data && props.actions.updateFirmware) {
			setBusy(true);
			try {
				setFirmwareUpdateActive(true);
				await props.actions.updateFirmware(
					loadedFile.name,
					Array.from(loadedFile.data),
				);
			} catch (e) {
				setFirmwareUpdateActive(false);
				alert(e);
			} finally {
				setBusy(false);
				setMessage(undefined);
			}
		}
	}

	async function abortFirmwareUpdate() {
		if (props.actions.abortFirmwareUpdate) {
			setBusy(true);
			try {
				await props.actions.abortFirmwareUpdate();
			} catch (e) {
				alert(e);
			} finally {
				setBusy(false);
				setFirmwareUpdateActive(false);
			}
		}
	}

	// Poll the healing progress while we're updating the firmware
	const [isPolling, setIsPolling] = React.useState(false);
	React.useEffect(() => {
		(async () => {
			if (
				firmwareUpdateActive &&
				!isPolling &&
				props.actions.pollFirmwareUpdateStatus
			) {
				setIsPolling(true);
				try {
					const result = await props.actions.pollFirmwareUpdateStatus();
					console.dir(result);
					setFirmwareUpdateStatus(result);
					if (result.type === "done") {
						const success =
							result.status! >=
							0xfd; /* OK_WaitingForActivation */
						let message = success
							? _("firmware update successful")
							: _("firmware update failed");
						if (success) {
							if (result.waitTime) {
								message +=
									" " +
									_("firmware update wait time").replace(
										"{0}",
										result.waitTime.toString(),
									);
							} else {
								message +=
									" " + _("firmware update no wait time");
							}
							message += " " + _("firmware update wake up");
						}
						setMessage(message);
						setLoadedFile(undefined);
						setFirmwareUpdateActive(false);
						setTimeout(() => {
							setFirmwareUpdateStatus(undefined);
						}, 10000);
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
	}, [isPolling, firmwareUpdateActive]);

	const updateProgressNumeric =
		firmwareUpdateStatus?.type === "progress" &&
		typeof firmwareUpdateStatus.totalFragments === "number" &&
		typeof firmwareUpdateStatus.sentFragments === "number"
			? Math.round(
					(firmwareUpdateStatus.sentFragments /
						firmwareUpdateStatus.totalFragments) *
						10000,
			  ) / 100
			: Number.NaN;

	// Notify the user to wake up the device
	React.useEffect(() => {
		if (firmwareUpdateStatus?.type === "done") return;
		if (props.status === "asleep" && firmwareUpdateActive) {
			setMessage(_("wake up device"));
		} else {
			setMessage(undefined);
		}
	}, [props.status, firmwareUpdateActive, firmwareUpdateStatus]);

	return (
		<>
			<h5>{_("Modal_Actions")}</h5>
			<div className="modal-actions-row">
				{/* Button to re-interview a node */}
				<a
					className={`btn ${isBusy ? "disabled" : ""}`}
					onClick={() => refreshInfo()}
				>
					{_("Refresh node info")}
				</a>
				{/* Button to remove failed nodes - only show them if the node may be failed */}

				<a
					className={`btn red ${
						!isNodeFailed || isBusy ? "disabled" : ""
					}`}
					title={
						isNodeFailed
							? undefined
							: _("This is not a failed node")
					}
					onClick={() => removeNode()}
				>
					{_("Remove failed node")}
				</a>
			</div>

			{supportsFirmwareUpdate && (
				<>
					<div className="divider"></div>

					<div className="modal-actions-row">
						<a
							className={`btn ${
								!isBusy && !firmwareUpdateActive
									? ""
									: "disabled"
							}`}
							onClick={loadFirmware}
							style={{ flex: "1 0 auto" }}
						>
							{_("Update Firmware")}
						</a>
						<input
							type="file"
							hidden
							id="firmwareFile"
							accept=".exe,.ex_,.ota,.otz,.hex,.hec,.gbl,.bin"
							ref={(ref) => {
								if (ref) input.current = ref;
							}}
							onChange={selectFirmware}
						/>
						{firmwareUpdateActive ? (
							<>
								<div
									className="progress"
									style={{
										margin: "0 1em",
										flex: "1 1 100%",
									}}
								>
									{Number.isNaN(updateProgressNumeric) ? (
										<div className="indeterminate"></div>
									) : (
										<div
											className="determinate"
											style={{
												width: `${updateProgressNumeric}%`,
											}}
										></div>
									)}
								</div>
								{!Number.isNaN(updateProgressNumeric) && (
									<div
										style={{
											whiteSpace: "nowrap",
											marginRight: "1em",
										}}
									>
										{updateProgressNumeric.toLocaleString(
											undefined,
											{
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											},
										)}
										{" %"}
									</div>
								)}
							</>
						) : (
							<span
								style={{
									flex: "1 1 100%",
									textAlign: "center",
									padding: "0 1em",
									wordBreak: "break-all",
								}}
							>
								{loadedFile
									? `${loadedFile.name} (${loadedFile.data.byteLength} bytes)`
									: _("no file selected")}
							</span>
						)}
						<a
							className={`btn ${
								!isBusy &&
								!firmwareUpdateActive &&
								loadedFile?.data
									? ""
									: "disabled"
							}`}
							title={_("start firmware update")}
							onClick={beginFirmwareUpdate}
							style={{ flex: "1 0 auto" }}
						>
							<i className="material-icons">file_upload</i>
						</a>{" "}
						<a
							className={`btn red ${
								!isBusy && firmwareUpdateActive
									? ""
									: "disabled"
							}`}
							title={_("abort firmware update")}
							onClick={abortFirmwareUpdate}
							style={{ flex: "1 0 auto" }}
						>
							<i className="material-icons">close</i>
						</a>
					</div>
					{message ? (
						<div>{message}</div>
					) : (
						<div className="orange-text text-darken-4">
							{_("firmware update warning")}
						</div>
					)}
				</>
			)}
		</>
	);
}
