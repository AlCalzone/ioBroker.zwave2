import { makeStyles } from "@material-ui/core/styles";
import { useAdapter, useDialogs, useI18n } from "iobroker-react/hooks";
import React from "react";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { SmartStartTableRow } from "../components/SmartStartTableRow";
import type { SmartStartProvisioningEntry } from "zwave-js";
import { Device, useAPI } from "../lib/useAPI";
import CircularProgress from "@material-ui/core/CircularProgress";
import type { SecurityClass } from "@zwave-js/core";
import Alert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import Dialog from "@material-ui/core/Dialog";
import { QRScanner } from "../components/QRScanner";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { Message, NotRunning } from "../components/Messages";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		display: "flex",
		flexFlow: "column nowrap",
		gap: theme.spacing(2),
	},
	container: {
		overflowY: "auto",
	},
	scannerDialogContent: {
		display: "flex",
		flexFlow: "column nowrap",
		alignItems: "center",
		gap: theme.spacing(1),
	},
}));

export interface SmartStartProps {
	devices: Record<number, Device> | undefined;
}

export const SmartStart: React.FC<SmartStartProps> = (props) => {
	const classes = useStyles();
	const { translate: _ } = useI18n();
	const api = useAPI();
	const { showModal } = useDialogs();
	const { alive: adapterRunning, connected: driverReady } = useAdapter();

	// Check for SmartStart support
	const [supportsSmartStart, setSupportsSmartStart] =
		React.useState<boolean>(false);
	React.useEffect(() => {
		if (driverReady) api.supportsSmartStart().then(setSupportsSmartStart);
	}, [driverReady, api]);

	const [entries, setEntries] =
		React.useState<SmartStartProvisioningEntry[]>();

	const updateEntries = React.useCallback(async () => {
		const entries = await api.getProvisioningEntries();
		entries.sort((a, b) => {
			const nodeIdA = a.nodeId || 999999;
			const nodeIdB = b.nodeId || 999999;
			const result = nodeIdA - nodeIdB;
			if (result) return result;
			return a.dsk.localeCompare(b.dsk);
		});
		setEntries(entries);
	}, [api, setEntries]);

	// Update entries initially and when the devices change
	React.useEffect(() => {
		updateEntries();
	}, [api, props.devices]);

	const provisionNode = React.useCallback(
		async (
			dsk: string,
			securityClasses: SecurityClass[],
			additionalData?: Record<string, any>,
		) => {
			await api.provisionSmartStartNode(
				dsk,
				securityClasses,
				additionalData,
			);
			await updateEntries();
		},
		[api, updateEntries],
	);

	const unprovisionNode = React.useCallback(
		async (dsk: string) => {
			const result = await showModal(
				_("Unprovision node?"),
				_(
					"Do you really want to remove this node from the provisioning list?",
				),
			);
			if (!result) return;

			await api.unprovisionSmartStartNode(dsk);
			await updateEntries();
		},
		[api, updateEntries],
	);

	const reprovisionNode = React.useCallback(
		async (
			oldDsk: string,
			newDsk: string,
			securityClasses: SecurityClass[],
			additionalData?: Record<string, any>,
		) => {
			if (oldDsk !== newDsk) {
				await api.unprovisionSmartStartNode(oldDsk);
			}
			await api.provisionSmartStartNode(
				newDsk,
				securityClasses,
				additionalData,
			);
			await updateEntries();
		},
		[api, updateEntries],
	);

	const [scannerNotification, setScannerNotification] = React.useState<{
		message: string;
		severity: "success" | "info" | "warning" | "error";
	}>();
	const [lastScanned, setLastScanned] = React.useState<string>();
	const [showQRCodeScanner, setShowQRCodeScanner] = React.useState(false);
	const closeQRCodeScanner = () => {
		setShowQRCodeScanner(false);
		setTimeout(() => setScannerNotification(undefined), 250);
	};
	const handleQRScan = async (code: string) => {
		try {
			const result = await api.scanQRCode(code, false);
			if (result.type === "none") {
				setScannerNotification({
					message: _("This is not a valid Z-Wave QR code"),
					severity: "error",
				});
			} else if (result.type === "SmartStart") {
				const { dsk, securityClasses, ...rest } = result;
				await provisionNode(dsk, securityClasses, rest);
				setLastScanned(dsk);
				setScannerNotification({
					message: _("Node successfully added to provisioning list"),
					severity: "success",
				});
			} else if (result.type === "S2") {
				setScannerNotification({
					message: _(
						"This is not a SmartStart QR code. Use the devices tab to include this node.",
					),
					severity: "warning",
				});
			} else if (result.type === "included") {
				setScannerNotification({
					message: _(
						"The device is already included as Node %s",
						result.nodeId.toString(),
					),
					severity: "info",
				});
			} else if (result.type === "provisioned") {
				// Avoid false positives when we just added this node
				if (result.dsk === lastScanned) return;

				setScannerNotification({
					message: _(
						"This node is already on the SmartStart provisioning list",
					),
					severity: "info",
				});
			}
		} catch (e) {
			// ignore
		}
	};

	if (!adapterRunning || !driverReady) return <NotRunning />;
	if (!entries || !props.devices) return <CircularProgress />;
	if (!supportsSmartStart) {
		return (
			<Message>
				{_("The controller does not support SmartStart!")}
			</Message>
		);
	}

	return (
		<div className={classes.root}>
			<Typography variant="body1">
				{_(
					"Define here which SmartStart capable nodes should be part of the network by entering their DSK and granting security classes.",
				)}
				<br />
				{_(
					"When a node announces itself, it will automatically be included within 10 minutes.",
				)}
			</Typography>

			<Alert severity="info">
				{_(
					"Removing an entry does not automatically exclude the node.",
				)}
			</Alert>

			{/* QR Code scanner */}
			<div>
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddAPhotoIcon />} // TODO: This should use MUI v5's QR code icon
					onClick={() => setShowQRCodeScanner(true)}
				>
					{_("Scan QR Code")}
				</Button>

				<Dialog
					open={showQRCodeScanner}
					onClose={closeQRCodeScanner}
					maxWidth={false}
				>
					<DialogTitle>{_("Scan QR Code")}</DialogTitle>
					<DialogContent className={classes.scannerDialogContent}>
						{scannerNotification && (
							<Alert severity={scannerNotification.severity}>
								{scannerNotification.message}
							</Alert>
						)}
						<QRScanner onDetect={handleQRScan} />
					</DialogContent>
					<DialogActions>
						<Button
							variant="contained"
							onClick={closeQRCodeScanner}
							color="primary"
						>
							{_("Close")}
						</Button>
					</DialogActions>
				</Dialog>
			</div>

			<Paper elevation={2}>
				<TableContainer className={classes.container}>
					<Table style={{ tableLayout: "auto" }}>
						<TableHead>
							<TableRow>
								<TableCell
									style={{ width: "50px" }}
									align="center"
								>
									#
								</TableCell>
								<TableCell style={{ minWidth: "480px" }}>
									{_("DSK")}
								</TableCell>
								<TableCell>{_("Security classes")}</TableCell>
								<TableCell
									style={{ minWidth: "200px" }}
								></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{entries.map((entry) => {
								const {
									nodeId,
									dsk,
									securityClasses,
									...additionalData
								} = entry;
								return (
									<SmartStartTableRow
										nodeId={entry.nodeId}
										key={`entry-${entry.dsk}`}
										dsk={entry.dsk}
										securityClasses={entry.securityClasses}
										additionalData={additionalData}
										provision={(
											dsk,
											secClasses,
											additional,
										) =>
											reprovisionNode(
												entry.dsk,
												dsk,
												secClasses,
												additional,
											)
										}
										unprovision={() =>
											unprovisionNode(entry.dsk)
										}
									/>
								);
							})}
							{/* Empty row to add new entries */}
							<SmartStartTableRow
								nodeId={undefined}
								dsk={undefined}
								securityClasses={[]}
								provision={provisionNode}
							/>
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</div>
	);
};
