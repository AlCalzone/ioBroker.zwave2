import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import RestoreIcon from "@material-ui/icons/Restore";
import SaveIcon from "@material-ui/icons/Save";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { isValidDSK, SecurityClass } from "@zwave-js/core/safe";
import clsx from "clsx";
import { useI18n } from "iobroker-react/hooks";
import { useEffect, useState } from "react";
import { ProvisioningEntryStatus } from "zwave-js/safe";
import { getErrorMessage } from "../../../src/lib/shared";
import { arrayEquals } from "../lib/tools";

const useStyles = makeStyles((theme) => ({
	cell: {
		padding: theme.spacing(1, 2),
	},
	withAdditionalData: {
		"& td": {
			paddingTop: 0,
		},
	},
	additionalData: {
		"& td": {
			color: theme.palette.text.hint,
			borderBottom: 0,
			paddingBottom: 0,
		},
	},
	idCell: {
		textAlign: "center",
	},
	input: {
		width: "100%",
		margin: 0,
	},
	securityClassToggle: {
		lineHeight: 1.1,
	},
}));

export interface SmartStartTableRowProps {
	nodeId: number | undefined;
	status: ProvisioningEntryStatus | undefined;
	dsk: string | undefined;
	securityClasses: SecurityClass[];
	additionalData?: Record<string, any>;

	// Will be called when the entry should be saved
	provision(
		status: ProvisioningEntryStatus,
		dsk: string,
		securityClasses: SecurityClass[],
		additionalData?: Record<string, any>,
	): Promise<void>;
	// Will be called when the entry should be deleted
	unprovision?(): Promise<void>;
}

export const SmartStartTableRow: React.FC<SmartStartTableRowProps> = (
	props,
) => {
	const classes = useStyles();
	const { translate: _ } = useI18n();

	const [status, setStatus] = useState(
		props.status ?? ProvisioningEntryStatus.Active,
	);
	const [dsk, setDsk] = useState(props.dsk ?? "");
	const [securityClasses, setSecurityClasses] = useState(
		props.securityClasses,
	);

	const [isValid, setValid] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [isBusy, setBusy] = useState(false);

	useEffect(() => {
		setHasChanges(
			status !== (props.status ?? ProvisioningEntryStatus.Active) ||
				(dsk !== "" && dsk !== props.dsk) ||
				!arrayEquals(securityClasses, props.securityClasses),
		);
		setValid(isValidDSK(dsk) && securityClasses.length > 0);
	}, [
		status,
		props.status,
		dsk,
		props.dsk,
		securityClasses,
		props.securityClasses,
	]);

	const handleDSKChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let dsk = e.target.value.replace(/[^0-9]/g, "");
		if (dsk.length > 40) dsk = dsk.substr(0, 40);
		// Format as chunks of 5 digits
		let result = "";
		for (let chunk = 1; chunk <= 8; chunk++) {
			if (dsk.length > chunk * 5) {
				result += dsk.substr((chunk - 1) * 5, 5) + "-";
			} else {
				result += dsk.substr((chunk - 1) * 5);
			}
		}
		setDsk(result);
	};

	const selectSecurity = (
		event: React.MouseEvent<HTMLElement>,
		secClasses: SecurityClass[],
	) => {
		setSecurityClasses(secClasses);
	};

	const isNewEntry = props.dsk == undefined;
	const isIncluded = props.nodeId != undefined;

	const resetEntry = () => {
		setStatus(props.status ?? ProvisioningEntryStatus.Active);
		setDsk(props.dsk ?? "");
		setSecurityClasses(props.securityClasses);
	};

	const unprovision = async () => {
		if (!props.unprovision) return;
		try {
			setBusy(true);
			await props.unprovision();
		} catch (e) {
			alert(_(`The node could not be unprovisioned!`));
			console.error(
				`The node could not be unprovisioned! Reason: ${getErrorMessage(
					e,
				)}`,
			);
			resetEntry();
		} finally {
			setBusy(false);
		}
	};

	const provision = async () => {
		try {
			setBusy(true);
			await props.provision(
				status,
				dsk,
				securityClasses,
				props.additionalData,
			);
			if (isNewEntry) resetEntry();
		} catch (e) {
			alert(_(`The node could not be provisioned!`));
			console.error(
				`The node could not be provisioned! Reason: ${getErrorMessage(
					e,
				)}`,
			);
			resetEntry();
		} finally {
			setBusy(false);
		}
	};

	// Display the node information where known
	let additionalData: string | undefined;
	if (props.additionalData) {
		if (props.additionalData.manufacturer) {
			additionalData = props.additionalData.manufacturer;
		}
		if (props.additionalData.label) {
			if (additionalData) additionalData += " ";
			additionalData += props.additionalData.label;
		}
		if (props.additionalData.description) {
			if (additionalData) additionalData += " - ";
			additionalData += props.additionalData.description;
		}
	}

	return (
		<>
			{!!additionalData && (
				<TableRow className={classes.additionalData}>
					<TableCell className={classes.cell} colSpan={2}></TableCell>
					<TableCell className={classes.cell} colSpan={2}>
						<Typography variant="caption">
							{additionalData}
						</Typography>
					</TableCell>
					<TableCell className={classes.cell}></TableCell>
				</TableRow>
			)}

			<TableRow
				className={clsx(!!additionalData && classes.withAdditionalData)}
			>
				<TableCell className={clsx(classes.cell, classes.idCell)}>
					{props.nodeId ?? ""}
				</TableCell>
				<TableCell className={classes.cell}>
					{!isNewEntry && (
						<Checkbox
							checked={status === ProvisioningEntryStatus.Active}
							onChange={(event, checked) =>
								setStatus(
									checked
										? ProvisioningEntryStatus.Active
										: ProvisioningEntryStatus.Inactive,
								)
							}
						/>
					)}
				</TableCell>

				<TableCell className={classes.cell}>
					{isIncluded ? (
						<Typography variant="body2">{dsk}</Typography>
					) : (
						<TextField
							variant="outlined"
							margin="dense"
							className={classes.input}
							value={dsk}
							placeholder={
								"00000-11111-22222-33333-44444-55555-66666-77777"
							}
							disabled={isBusy}
							onChange={handleDSKChange}
						></TextField>
					)}
				</TableCell>
				<TableCell className={classes.cell}>
					<ToggleButtonGroup
						value={securityClasses}
						onChange={selectSecurity}
						size="small"
					>
						<ToggleButton
							value={SecurityClass.S2_AccessControl}
							color="secondary"
							className={classes.securityClassToggle}
							disabled={isIncluded || isBusy}
						>
							S2 AC
						</ToggleButton>
						<ToggleButton
							value={SecurityClass.S2_Authenticated}
							className={classes.securityClassToggle}
							disabled={isIncluded || isBusy}
						>
							S2 Auth
						</ToggleButton>
						<ToggleButton
							value={SecurityClass.S2_Unauthenticated}
							className={classes.securityClassToggle}
							disabled={isIncluded || isBusy}
						>
							S2 Unauth
						</ToggleButton>
						<ToggleButton
							value={SecurityClass.S0_Legacy}
							className={classes.securityClassToggle}
							disabled={isIncluded || isBusy}
						>
							S0 Legacy
						</ToggleButton>
					</ToggleButtonGroup>
				</TableCell>

				<TableCell className={classes.cell}>
					<ButtonGroup
						variant="contained"
						color="primary"
						style={{ flex: "1 0 auto" }}
					>
						<Tooltip title={_("Provision node")}>
							<Button
								disabled={
									isBusy ||
									!isValid ||
									!hasChanges ||
									isIncluded
								}
								onClick={provision}
							>
								{isNewEntry ? <AddIcon /> : <SaveIcon />}
							</Button>
						</Tooltip>

						<Tooltip title={_("Undo changes")}>
							<Button
								disabled={isBusy || !hasChanges || isIncluded}
								onClick={resetEntry}
							>
								<RestoreIcon />
							</Button>
						</Tooltip>

						{!isNewEntry && (
							<Tooltip title={_("Unprovision")}>
								<Button
									disabled={isBusy}
									onClick={() => unprovision()}
								>
									<DeleteForeverIcon />
								</Button>
							</Tooltip>
						)}
					</ButtonGroup>
				</TableCell>
			</TableRow>
		</>
	);
};
