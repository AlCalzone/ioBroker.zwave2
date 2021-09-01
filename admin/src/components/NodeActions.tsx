import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import {
	FirmwareUpdatePollResponse,
	getErrorMessage,
} from "../../../src/lib/shared";
import { useAPI } from "../lib/useAPI";
import { useI18n } from "iobroker-react/hooks";
import PublishIcon from "@material-ui/icons/Publish";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CloseIcon from "@material-ui/icons/Close";

export interface NodeActionsProps {
	nodeId: number;
	status: string | undefined;
	isBusy: boolean;
	setBusy: (isBusy: boolean) => void;
	supportsFirmwareUpdate: boolean;
}

interface LoadedFile {
	name: string;
	data: Uint8Array;
}

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(1),
	},
	nodeActionsRow: {
		display: "flex",
		flexFlow: "row nowrap",
		margin: theme.spacing(1, 0),
		justifyContent: "space-between",
		alignItems: "center",

		"&:not(:first-of-type)": {
			marginTop: theme.spacing(4),
		},
	},
}));

export const NodeActions: React.FC<NodeActionsProps> = (props) => {
	const [loadedFile, setLoadedFile] = React.useState<LoadedFile>();
	const [firmwareUpdateActive, setFirmwareUpdateActive] =
		React.useState(false);
	const [firmwareUpdateStatus, setFirmwareUpdateStatus] =
		React.useState<FirmwareUpdatePollResponse>();
	const [message, setMessage] = React.useState<string>();

	const input = React.useRef<HTMLInputElement>();

	const api = useAPI();
	const { nodeId, isBusy, setBusy, supportsFirmwareUpdate } = props;
	const { translate: _ } = useI18n();

	// It can happen that the controller does not react to commands for a failed node,
	// so the status won't change. We need to allow removing the node in this case too,
	// so just forbid removing alive or awake nodes
	const isNodeFailed = props.status !== "alive" && props.status !== "awake";

	async function removeNode() {
		setBusy(true);
		try {
			await api.removeFailedNode(nodeId);
		} catch (e) {
			alert(e);
		} finally {
			setBusy(false);
		}
	}

	async function refreshInfo() {
		setBusy(true);
		try {
			await api.refreshNodeInfo(nodeId);
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
		if (supportsFirmwareUpdate && loadedFile?.data) {
			setBusy(true);
			try {
				setFirmwareUpdateActive(true);
				await api.beginFirmwareUpdate(
					nodeId,
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
		setBusy(true);
		try {
			await api.abortFirmwareUpdate(nodeId);
		} catch (e) {
			alert(e);
		} finally {
			setBusy(false);
			setFirmwareUpdateActive(false);
		}
	}

	// Poll the firmware update progress while we're updating the firmware
	const [isPolling, setIsPolling] = React.useState(false);
	React.useEffect(() => {
		(async () => {
			if (firmwareUpdateActive && !isPolling) {
				setIsPolling(true);
				try {
					const result = await api.pollFirmwareUpdateStatus(nodeId);
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
					console.error(`Error while polling: ${getErrorMessage(e)}`);
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

	const classes = useStyles();

	return (
		<div className={classes.root}>
			<div className={classes.nodeActionsRow}>
				{/* Button to re-interview a node */}
				<Button
					disabled={isBusy}
					variant="contained"
					color="primary"
					onClick={() => refreshInfo()}
				>
					{_("Refresh node info")}
				</Button>

				{/* Button to remove failed nodes - only show them if the node may be failed */}
				<Tooltip
					title={isNodeFailed ? "" : _("This is not a failed node")}
				>
					<span>
						{/* The span is necessary to show a tooltip on a disabled button */}
						<Button
							disabled={!isNodeFailed || isBusy}
							variant="contained"
							color="primary"
							onClick={() => removeNode()}
						>
							{_("Remove failed node")}
						</Button>
					</span>
				</Tooltip>
			</div>

			{supportsFirmwareUpdate && (
				<>
					<div className={classes.nodeActionsRow}>
						<Button
							disabled={firmwareUpdateActive || isBusy}
							variant="contained"
							color="primary"
							onClick={() => loadFirmware()}
							style={{ flex: "1 0 auto" }}
						>
							{_("Update Firmware")}
						</Button>
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
						<ButtonGroup
							variant="contained"
							color="primary"
							style={{ flex: "1 0 auto" }}
						>
							<Tooltip title={_("start firmware update")}>
								<Button
									disabled={
										firmwareUpdateActive ||
										isBusy ||
										!loadedFile?.data
									}
									onClick={() => beginFirmwareUpdate()}
								>
									<PublishIcon />
								</Button>
							</Tooltip>

							<Tooltip title={_("abort firmware update")}>
								<Button
									disabled={!firmwareUpdateActive || isBusy}
									onClick={() => abortFirmwareUpdate()}
								>
									<CloseIcon />
								</Button>
							</Tooltip>
						</ButtonGroup>
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
		</div>
	);
};
