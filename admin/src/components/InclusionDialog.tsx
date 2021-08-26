/* eslint-disable @typescript-eslint/no-empty-function */
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useI18n } from "iobroker-react/hooks";
import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
import { green, yellow } from "@material-ui/core/colors";
import clsx from "clsx";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import type { InclusionGrant } from "zwave-js/Controller";

const useStyles = makeStyles((theme) => ({
	strategyRoot: {
		// maxWidth: "600px",
	},
	strategyGridHeadline: {
		marginTop: theme.spacing(4),
	},
	strategyGrid: {
		marginTop: theme.spacing(1),
		display: "grid",
		gridTemplateColumns: "auto 400px",
		gridGap: theme.spacing(2),
		alignItems: "center",
	},
	waitMessageRoot: {
		display: "grid",
		gridTemplateColumns: "minmax(auto, 10ch) 1fr",
		gridGap: theme.spacing(4),
		alignItems: "center",
		// width: "600px",
		overflow: "hidden",
	},
	grantRoot: {
		display: "flex",
		flexFlow: "column nowrap",
		gap: theme.spacing(1),
		maxWidth: "600px",
	},
	grantHeadline: {
		marginTop: theme.spacing(-1),
		marginBottom: theme.spacing(1),
	},
	grantCSA: {
		marginTop: theme.spacing(2),
	},
	validateDSKRoot: {
		maxWidth: "600px",
	},
	validateDSKGrid: {
		marginTop: theme.spacing(1),
		display: "grid",
		width: "100%",
		gridTemplateColumns: "minmax(auto, 10ch) 1fr",
		gridGap: theme.spacing(1),
		alignItems: "center",
		textAlign: "center",
	},
	resultRoot: {
		display: "grid",
		gridTemplateColumns: "auto 1fr",
		gridTemplateRows: "auto auto auto",
		alignItems: "center",
	},
	resultIcon: {
		marginRight: theme.spacing(4),
		fontSize: "64px",
		gridRow: "1 / span 3",
		gridColumn: 1,
	},
	resultIconOK: {
		color: green[500],
	},
	resultIconLowSecurity: {
		color: yellow[700],
	},
}));

export enum InclusionStep {
	SelectStrategy,
	IncludeDevice,
	GrantSecurityClasses,
	ValidateDSK,
	Busy,
	Result,
}

// Copied from zwave-js
export enum InclusionStrategy {
	Default = 0,
	SmartStart,
	Insecure,
	// Only for replacing nodes:
	Security_S0,
	Security_S2,
}

// =============================================================================

interface SelectStrategyStepProps {
	selectStrategy: (
		strategy: InclusionStrategy,
		forceSecurity?: boolean,
	) => void;
	onCancel: () => void;
}

const SelectStrategyStep: React.FC<SelectStrategyStepProps> = (props) => {
	const { translate: _ } = useI18n();
	const classes = useStyles();

	const [forceSecurity, setForceSecurity] = React.useState(false);

	const strategyCaptionDefault = forceSecurity
		? _(
				"Security S2 when supported, Security S0 as a fallback, no encryption otherwise.",
		  )
		: _(
				"Security S2 when supported, Security S0 only when necessary, no encryption otherwise.",
		  );

	return (
		<>
			<DialogContent className={classes.strategyRoot}>
				<Typography variant="body2">
					{_("Z-Wave supports the following security mechanisms:")}
				</Typography>
				<Typography variant="body2">
					<ul style={{ marginTop: "0.5em" }}>
						<li>
							<b>Security S2</b> &ndash; {_("fast and secure")}{" "}
							<b>{_("(recommended)")}</b>
						</li>
						<li>
							<b>Security S0</b> &ndash;{" "}
							{_("secure, but slow due to a lot of overhead")}{" "}
							<b>{_("(use only when necessary)")}</b>
						</li>
						<li>{_("No encryption")}</li>
					</ul>
				</Typography>

				<Typography
					variant="body1"
					className={classes.strategyGridHeadline}
				>
					{_("Please choose an inclusion strategy")}:
				</Typography>
				<div className={classes.strategyGrid}>
					<div
						style={{
							gridRow: 1,
							display: "flex",
							flexFlow: "column",
						}}
					>
						<Button
							variant="contained"
							color="primary"
							onClick={() =>
								props.selectStrategy(
									InclusionStrategy.Default,
									forceSecurity,
								)
							}
						>
							{_("Default (secure)")}
						</Button>
						<FormControlLabel
							label={_("Prefer S0 over no encryption")}
							control={
								<Checkbox
									checked={forceSecurity}
									onChange={(event, checked) =>
										setForceSecurity(checked)
									}
								/>
							}
						/>
					</div>
					<Typography
						variant="caption"
						style={{ alignSelf: "flex-start" }}
					>
						{strategyCaptionDefault}
						<br />
						{_("Requires user interaction during the inclusion.")}
					</Typography>

					<Button
						variant="contained"
						color="secondary"
						style={{ gridRow: 2 }}
						disabled
						onClick={() =>
							props.selectStrategy(InclusionStrategy.SmartStart)
						}
					>
						{"SmartStart"}
					</Button>
					<Typography variant="caption">coming soon...</Typography>

					<Button
						variant="contained"
						color="default"
						style={{ gridRow: 3 }}
						onClick={() =>
							props.selectStrategy(InclusionStrategy.Insecure)
						}
					>
						{_("No encryption")}
					</Button>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onCancel} color="primary">
					{_("Cancel")}
				</Button>
			</DialogActions>
		</>
	);
};

// =============================================================================

export interface WaitMessageProps {
	message: string;
	onCancel?: () => void;
}

const WaitMessageStep: React.FC<WaitMessageProps> = (props) => {
	const classes = useStyles();
	const { translate: _ } = useI18n();

	return (
		<>
			<DialogContent className={classes.waitMessageRoot}>
				<CircularProgress size={48} />
				<Typography variant="body1">{props.message}</Typography>
			</DialogContent>
			<DialogActions>
				{props.onCancel && (
					<Button onClick={props.onCancel} color="primary">
						{_("Cancel")}
					</Button>
				)}
			</DialogActions>
		</>
	);
};

// =============================================================================

interface GrantSecurityClassesStepProps {
	request: InclusionGrant;
	grantSecurityClasses: (grant: InclusionGrant) => void;
	onCancel: () => void;
}

const GrantSecurityClassesStep: React.FC<GrantSecurityClassesStepProps> = (
	props,
) => {
	const { translate: _ } = useI18n();
	const classes = useStyles();

	const request = props.request;
	const requestS2AccessControl = request.securityClasses.includes(2);
	const requestS2Authenticated = request.securityClasses.includes(1);
	const requestS2Unauthenticated = request.securityClasses.includes(0);
	const requestS0Legacy = request.securityClasses.includes(7);
	const requestCSA = request.clientSideAuth;

	const [grantS2AccessControl, setGrantS2AccessControl] = React.useState(
		requestS2AccessControl,
	);
	const [grantS2Authenticated, setGrantS2Authenticated] = React.useState(
		requestS2Authenticated,
	);
	const [grantS2Unauthenticated, setGrantS2Unauthenticated] = React.useState(
		requestS2Unauthenticated,
	);
	const [grantS0Legacy, setGrantS0Legacy] = React.useState(requestS0Legacy);
	const [grantCSA, setGrantCSA] = React.useState(requestCSA);

	// This will be called when the user clicks confirm
	const handleOk = () => {
		const securityClasses: InclusionGrant["securityClasses"] = [];
		if (grantS2AccessControl) securityClasses.push(2);
		if (grantS2Authenticated) securityClasses.push(1);
		if (grantS2Unauthenticated) securityClasses.push(0);
		if (grantS0Legacy) securityClasses.push(7);

		const grant: InclusionGrant = {
			securityClasses,
			clientSideAuth: grantCSA,
		};
		props.grantSecurityClasses(grant);
	};

	return (
		<>
			<DialogContent className={classes.grantRoot}>
				<Typography variant="body1">
					{_(
						"Please choose which of the following security classes to grant to the new node.",
					)}
				</Typography>
				<Typography variant="caption" className={classes.grantHeadline}>
					{_(
						"At least one must be granted or the key exchange will be canceled.",
					)}
				</Typography>

				<FormControlLabel
					label={
						<>
							<b>
								S2 Access Control
								{!requestS2AccessControl && (
									<> ({_("not requested")})</>
								)}
							</b>
							<br />
							<Typography variant="caption">
								{_("Example:")} {_("Door locks, garage doors")},
								...
							</Typography>
						</>
					}
					disabled={!requestS2AccessControl}
					control={
						<Checkbox
							checked={grantS2AccessControl}
							onChange={(event, checked) =>
								setGrantS2AccessControl(checked)
							}
						/>
					}
				/>
				<FormControlLabel
					label={
						<>
							<b>
								S2 Authenticated
								{!requestS2Authenticated && (
									<> ({_("not requested")})</>
								)}
							</b>
							<br />
							<Typography variant="caption">
								{_("Example:")}{" "}
								{_("Lighting, sensors, security systems")}, ...
							</Typography>
						</>
					}
					disabled={!requestS2Authenticated}
					control={
						<Checkbox
							checked={grantS2Authenticated}
							onChange={(event, checked) =>
								setGrantS2Authenticated(checked)
							}
						/>
					}
				/>
				<FormControlLabel
					label={
						<>
							<b>
								S2 Unauthenticated
								{!requestS2Unauthenticated && (
									<> ({_("not requested")})</>
								)}
							</b>
							<br />
							<Typography variant="caption">
								{_(
									"Like S2 Authenticated, but without verification that the correct device is included",
								)}
							</Typography>
						</>
					}
					disabled={!requestS2Unauthenticated}
					control={
						<Checkbox
							checked={grantS2Unauthenticated}
							onChange={(event, checked) =>
								setGrantS2Unauthenticated(checked)
							}
						/>
					}
				/>
				<FormControlLabel
					label={
						<>
							<b>
								S0 Legacy
								{!requestS0Legacy && (
									<> ({_("not requested")})</>
								)}
							</b>
							<br />
							<Typography variant="caption">
								{_("Example:")}{" "}
								{_("Legacy door locks without S2 support")}
							</Typography>
						</>
					}
					disabled={!requestS0Legacy}
					control={
						<Checkbox
							checked={grantS0Legacy}
							onChange={(event, checked) =>
								setGrantS0Legacy(checked)
							}
						/>
					}
				/>
				<FormControlLabel
					className={classes.grantCSA}
					label={
						<>
							<b>
								Client Side Authentication
								{!requestCSA && <> ({_("not requested")})</>}
							</b>
							<br />
							<Typography variant="caption">
								{_(
									"For devices without a DSK. Authentication of the inclusion happens on the device instead of in ioBroker.",
								)}
							</Typography>
						</>
					}
					disabled={!requestCSA}
					control={
						<Checkbox
							checked={grantCSA}
							onChange={(event, checked) => setGrantCSA(checked)}
						/>
					}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleOk} color="primary">
					{_("OK")}
				</Button>
				<Button onClick={props.onCancel} color="primary">
					{_("Cancel")}
				</Button>
			</DialogActions>
		</>
	);
};

// =============================================================================

interface ValidateDSKStepProps {
	setPIN: (pin: string) => void;
	onCancel: () => void;
	dsk: string;
}

const ValidateDSKStep: React.FC<ValidateDSKStepProps> = (props) => {
	const { translate: _ } = useI18n();

	const [pin, setPIN] = React.useState("");
	const [error, setError] = React.useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const pin = event.target.value.replace(/[^0-9]/g, "");
		setPIN(pin);
		setError(false);
	};

	const handleBlur = () => {
		if (pin.length !== 5) setError(true);
	};

	const handleOk = () => {
		if (!error) props.setPIN(pin);
	};

	const classes = useStyles();
	return (
		<>
			<DialogContent className={classes.validateDSKRoot}>
				<Typography
					variant="body1"
					className={classes.strategyGridHeadline}
				>
					{_(
						"Please enter the 5-digit PIN for your device and verify that the rest of the device-specific key (DSK) matches the one on your device or the manual.",
					)}
				</Typography>
				<div className={classes.validateDSKGrid}>
					<TextField
						autoFocus={true}
						variant="outlined"
						margin="dense"
						inputProps={{
							maxLength: 5,
							style: { textAlign: "center" },
						}}
						value={pin}
						error={!!error}
						onChange={handleChange}
						onBlur={handleBlur}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleOk();
							if (e.key === "Escape") props.onCancel();
						}}
					></TextField>
					<Typography variant="body1">{props.dsk}</Typography>
					<Typography variant="caption">PIN</Typography>
					<Typography variant="caption">DSK</Typography>
				</div>
			</DialogContent>
			<DialogActions>
				<Button disabled={!!error} onClick={handleOk} color="primary">
					{_("OK")}
				</Button>
				<Button onClick={props.onCancel} color="primary">
					{_("Cancel")}
				</Button>
			</DialogActions>
		</>
	);
};

// =============================================================================

export interface ResultStepProps {
	nodeId: number;
	lowSecurity: boolean;
	securityClass?: string;
	onDone: () => void;
}

const ResultStep: React.FC<ResultStepProps> = (props) => {
	const { translate: _ } = useI18n();
	const classes = useStyles();

	const Icon = props.lowSecurity ? WarningIcon : CheckCircleIcon;
	const caption = props.lowSecurity
		? _("Node %s was added insecurely!", props.nodeId.toString())
		: _("Node %s was added successfully!", props.nodeId.toString());
	const message1 = props.lowSecurity
		? _(
				"There was an error during secure inclusion. To try again, exclude the node first.",
		  )
		: _("Security class: %s", props.securityClass ?? _("None"));

	const message2 = _(
		"The device is now being interviewed. It might take a while to show up.",
	);

	return (
		<>
			<DialogContent className={classes.resultRoot}>
				<Icon
					className={clsx(
						classes.resultIcon,
						props.lowSecurity
							? classes.resultIconLowSecurity
							: classes.resultIconOK,
					)}
				/>
				<Typography
					variant="body1"
					style={{ fontWeight: "bold", fontSize: "125%" }}
				>
					{caption}
				</Typography>
				<Typography variant="body2">{message1}</Typography>
				<Typography variant="body2">{message2}</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onDone} color="primary">
					{_("OK")}
				</Button>
			</DialogActions>
		</>
	);
};

export type InclusionDialogProps = {
	onCancel: () => void;
} & (
	| ({ step: InclusionStep.SelectStrategy } & SelectStrategyStepProps)
	| { step: InclusionStep.IncludeDevice }
	| ({
			step: InclusionStep.GrantSecurityClasses;
	  } & GrantSecurityClassesStepProps)
	| ({ step: InclusionStep.ValidateDSK } & ValidateDSKStepProps)
	| { step: InclusionStep.Busy }
	| ({ step: InclusionStep.Result } & ResultStepProps)
);

export const InclusionDialog: React.FC<
	InclusionDialogProps & { isOpen: boolean }
> = (props) => {
	const { translate: _ } = useI18n();

	// const [isOpen, setOpen] = React.useState(props.isOpen ?? false);
	// React.useEffect(() => {
	// 	setOpen(props.isOpen ?? false);
	// }, [props.isOpen]);

	const Content = React.useMemo(() => {
		switch (props.step) {
			case InclusionStep.SelectStrategy:
				return (
					<SelectStrategyStep
						selectStrategy={props.selectStrategy}
						onCancel={props.onCancel}
					/>
				);
			case InclusionStep.IncludeDevice:
				return (
					<WaitMessageStep
						message={_("Put your device into inclusion mode")}
						onCancel={props.onCancel}
					/>
				);
			case InclusionStep.GrantSecurityClasses:
				return (
					<GrantSecurityClassesStep
						grantSecurityClasses={props.grantSecurityClasses}
						request={props.request}
						onCancel={props.onCancel}
					/>
				);
			case InclusionStep.ValidateDSK:
				return (
					<ValidateDSKStep
						dsk={props.dsk}
						onCancel={props.onCancel}
						setPIN={props.setPIN}
					/>
				);
			case InclusionStep.Result:
				return (
					<ResultStep
						nodeId={props.nodeId}
						lowSecurity={props.lowSecurity}
						securityClass={props.securityClass}
						onDone={props.onDone}
					/>
				);
			case InclusionStep.Busy:
				return (
					<WaitMessageStep
						message={_(
							"Communicating with the device, please be patient...",
						)}
					/>
				);
		}
	}, [props.step]);

	return (
		<Dialog
			open={props.isOpen}
			onClose={props.onCancel}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			maxWidth={false}
		>
			<DialogTitle id="alert-dialog-title">
				{_("Include device")}
			</DialogTitle>
			{Content}
		</Dialog>
	);
};
