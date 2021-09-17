import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import type { FirmwareUpdateProgress } from "../../../src/lib/shared";
import { useAPI } from "../lib/useAPI";
import { useDialogs, useI18n } from "iobroker-react/hooks";
import PublishIcon from "@material-ui/icons/Publish";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CloseIcon from "@material-ui/icons/Close";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import { usePush } from "../lib/usePush";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import MemoryIcon from "@material-ui/icons/Memory";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";

export interface NodeActionsProps {
	nodeId: number;
	status: string | undefined;
	isBusy: boolean;
	setBusy: (isBusy: boolean) => void;
	replaceFailedNode: () => void;
	supportsFirmwareUpdate: boolean;
}

interface LoadedFile {
	name: string;
	data: Uint8Array;
}

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(2, 0),
		display: "grid",
		gridTemplateColumns: "auto 1fr",
		alignItems: "center",
		columnGap: theme.spacing(4),
		rowGap: theme.spacing(2),
	},
	firmwareUpdate: {
		gridColumn: "1 / span 2",
		display: "flex",
		flexFlow: "row nowrap",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: theme.spacing(4),
	},
	firmwareUpdateMessage: {
		gridColumn: "1 / span 2",
	},
	warning: {
		color: theme.palette.warning.main,
	},
	redButton: {
		background: theme.palette.error.main,
		"&:hover": {
			background: theme.palette.error.dark,
		},
	},
}));

export const NodeActions: React.FC<NodeActionsProps> = (props) => {
	const [loadedFile, setLoadedFile] = React.useState<LoadedFile>();
	const [firmwareUpdateActive, setFirmwareUpdateActive] =
		React.useState(false);
	const [firmwareUpdateStatus, setFirmwareUpdateStatus] =
		React.useState<FirmwareUpdateProgress>();
	const [message, setMessage] = React.useState<string>();

	const input = React.useRef<HTMLInputElement>();

	const api = useAPI();
	const { nodeId, isBusy, setBusy, supportsFirmwareUpdate } = props;
	const { translate: _ } = useI18n();

	const { showNotification, showModal } = useDialogs();

	// It can happen that the controller does not react to commands for a failed node,
	// so the status won't change. We need to allow removing the node in this case too,
	// so just forbid removing alive or awake nodes
	const isNodeFailed = props.status !== "alive" && props.status !== "awake";

	async function removeNode() {
		const result = await showModal(
			_("Remove node?"),
			_("Do you really want to remove this node from the network?"),
		);
		if (!result) return;

		setBusy(true);
		try {
			await api.removeFailedNode(nodeId);
		} catch (e) {
			alert(e);
		} finally {
			setBusy(false);
		}
	}

	async function replaceNode() {
		const result = await showModal(
			_("Replace node?"),
			_("Do you really want to replace this node?"),
		);
		if (result) props.replaceFailedNode();
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
				setFirmwareUpdateStatus({
					type: "progress",
					sentFragments: 0,
					totalFragments: 1,
				});
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

	usePush((payload) => {
		if (payload.type === "firmwareUpdate") {
			const progress = payload.progress;
			setFirmwareUpdateStatus(progress);

			if (progress.type === "done") {
				const success =
					progress.status! >= 0xfd; /* OK_WaitingForActivation */
				if (!success) {
					showNotification(_("firmware update failed"), "error");
					setMessage(undefined);
				} else {
					let message = _("firmware update successful");
					if (success) {
						if (progress.waitTime) {
							message +=
								" " +
								_("firmware update wait time").replace(
									"{0}",
									progress.waitTime.toString(),
								);
						} else {
							message += " " + _("firmware update no wait time");
						}
						message += " " + _("firmware update wake up");
					}
					setMessage(message);
				}
				setLoadedFile(undefined);
				setFirmwareUpdateActive(false);
				setTimeout(() => {
					setFirmwareUpdateStatus(undefined);
				}, 10000);
			} else {
				// For good measure, in case someone reloaded the page
				setFirmwareUpdateActive(true);
			}
		}
	});

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
			{/* Button to re-interview a node */}
			<Button
				disabled={isBusy}
				variant="contained"
				color="primary"
				startIcon={<RestorePageIcon />}
				onClick={() => refreshInfo()}
				fullWidth
			>
				{_("Refresh node info")}
			</Button>
			<Typography variant="body2">
				{_(
					"Forget all information about all nodes and re-interview them. Battery-powered nodes might need to be woken up manually.",
				)}
			</Typography>

			{/* Button to remove failed nodes - only show them if the node may be failed */}
			<Tooltip title={isNodeFailed ? "" : _("This is not a failed node")}>
				<span>
					{/* The span is necessary to show a tooltip on a disabled button */}
					<Button
						disabled={!isNodeFailed || isBusy}
						variant="contained"
						className={classes.redButton}
						onClick={removeNode}
						startIcon={<DeleteOutlineIcon />}
						fullWidth
					>
						{_("Remove failed node")}
					</Button>
				</span>
			</Tooltip>
			<Typography variant="body2">
				{_("Remove this node from the network.")}{" "}
				<span className={classes.warning}>
					{_(
						"WARNING: Only do this if you no longer have physical access.",
					)}
				</span>
			</Typography>

			{/* Button to replace failed nodes - only show them if the node may be failed */}
			<Tooltip title={isNodeFailed ? "" : _("This is not a failed node")}>
				<span>
					{/* The span is necessary to show a tooltip on a disabled button */}
					<Button
						disabled={!isNodeFailed || isBusy}
						variant="contained"
						className={classes.redButton}
						onClick={replaceNode}
						startIcon={<SwapHorizIcon />}
						fullWidth
					>
						{_("Replace failed node")}
					</Button>
				</span>
			</Tooltip>
			<Typography variant="body2">
				{_(
					"Replace this node with a different one, keeping the node ID.",
				)}{" "}
				<span className={classes.warning}>
					{_(
						"WARNING: Make sure that the node is reset before attempting this.",
					)}
				</span>
			</Typography>

			{supportsFirmwareUpdate && (
				<>
					<div className={classes.firmwareUpdate}>
						<Button
							disabled={firmwareUpdateActive || isBusy}
							variant="contained"
							color="primary"
							onClick={() => loadFirmware()}
							style={{ flex: "1 0 auto" }}
							startIcon={<MemoryIcon />}
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
										<LinearProgress />
									) : (
										<LinearProgress
											variant="determinate"
											value={updateProgressNumeric}
										/>
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
						<div className={classes.firmwareUpdateMessage}>
							{message}
						</div>
					) : (
						<div
							className={clsx(
								classes.firmwareUpdateMessage,
								classes.warning,
							)}
						>
							{_("firmware update warning")}
						</div>
					)}
				</>
			)}
		</div>
	);
};
