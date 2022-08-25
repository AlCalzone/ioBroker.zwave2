import ReactDOM from "react-dom";

// import { OnSettingsChangedCallback } from "./pages/settings";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SyncIcon from "@material-ui/icons/Sync";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { SettingsApp } from "iobroker-react/app";
import { useI18n, useSettings } from "iobroker-react/hooks";
import type { Translations } from "iobroker-react/i18n";
import { Fragment, memo, useEffect, useState } from "react";
import { TooltipIcon } from "./components/TooltipIcon";
import { UpdateDeviceConfig } from "./components/UpdateDeviceConfig";
import { useAPI } from "./lib/useAPI";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: "flex",
			flexGrow: 1,
			flexFlow: "column nowrap",
			gap: theme.spacing(8),
		},
		keyGrid: {
			display: "grid",
			gridTemplateColumns: "1fr auto",
			alignItems: "center",
			gap: theme.spacing(2),
		},
		keyGridLabel: {
			marginTop: theme.spacing(2),
			gridColumn: "1 / span 2",
		},
		keyGrid_TextField: {
			flexGrow: 1,
			// flexBasis: "100%",
		},
		keyGrid_Button: {
			flexGrow: 0,
		},
	}),
);

const networkKeyFields = [
	[
		2 /* SecurityClass.S2_AccessControl */,
		"networkKey_S2_AccessControl",
		"S2 Access Control",
	],
	[
		1 /* SecurityClass.S2_Authenticated */,
		"networkKey_S2_Authenticated",
		"S2 Authenticated",
	],
	[
		0 /* SecurityClass.S2_Unauthenticated */,
		"networkKey_S2_Unauthenticated",
		"S2 Unauthenticated",
	],
	[7 /* SecurityClass.S0_Legacy */, "networkKey_S0", "S0 (Legacy)"],
] as const;

const SettingsPageContent: React.FC = memo(() => {
	const { settings, originalSettings, setSettings } =
		useSettings<ioBroker.AdapterConfig>();
	const classes = useStyles();
	const { translate: _, language } = useI18n();
	const api = useAPI();

	const handleChange = <T extends keyof ioBroker.AdapterConfig>(
		option: T,
		value: ioBroker.AdapterConfig[T],
	) => {
		setSettings((s) => ({
			...s,
			[option]: value,
		}));
	};

	const generateNetworkKey = (which: keyof ioBroker.AdapterConfig) => {
		if (
			!settings[which] ||
			settings[which] !== originalSettings[which] ||
			confirm(_("network key confirm"))
		) {
			const bytes = new Uint8Array(16);
			window.crypto.getRandomValues(bytes);
			const hexKey = [...bytes]
				.map((x) => x.toString(16).padStart(2, "0"))
				.join("");
			handleChange(which, hexKey);
		}
	};

	const validateNetworkKey = (which: keyof ioBroker.AdapterConfig) => {
		const networkKey = settings[which] as string | undefined;
		if (!networkKey) return;
		if (!/[0-9a-fA-F]{32}/.test(networkKey)) {
			alert(_("Invalid network key"));
			// reset
			handleChange(which, originalSettings[which]);
		}
	};

	const handleNetworkKeyPaste = (
		which: keyof ioBroker.AdapterConfig,
		e: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>,
	) => {
		// Stop data actually being pasted
		e.stopPropagation();
		e.preventDefault();

		// Get pasted data via clipboard API
		// @ts-expect-error browser compatibility
		const clipboardData = e.clipboardData || window.clipboardData;
		let pastedData: string = clipboardData.getData("Text");

		if (pastedData) {
			// clean up any unwanted fragents
			pastedData = pastedData
				.trim()
				.replace(/0x/g, "")
				.replace(/[^0-9a-fA-F]+/g, "")
				.toLowerCase()
				.slice(0, 32);
		}
		handleChange(which, pastedData);
	};

	const [serialPorts, setSerialPorts] = useState<string[]>([]);
	useEffect(() => {
		api.listSerialPorts()
			.then((ports) => {
				if (ports.length) {
					setSerialPorts(ports);
				}
			})
			.catch((e) => {
				console.error(`Cannot retrieve serial ports: ${e}`);
			});
	}, []);

	return (
		<div className={classes.root}>
			<Grid container spacing={8}>
				<Grid container item xs={12} sm spacing={2} direction="column">
					<Grid item xs>
						<Autocomplete
							options={serialPorts}
							freeSolo={true}
							forcePopupIcon={true}
							noOptionsText=""
							autoSelect={true}
							clearOnBlur={true}
							onChange={(event, value) =>
								handleChange("serialport", value ?? "")
							}
							renderInput={(props) => (
								<TextField
									{...props}
									label={_("Select serial port")}
									margin="normal"
								/>
							)}
							value={settings.serialport}
						/>
						<Typography variant="body2">
							{_("hosted port tip")}
						</Typography>
					</Grid>

					<Grid item xs>
						<FormControlLabel
							label={_(
								"Disable restarting the controller on startup",
							)}
							control={
								<Checkbox
									checked={settings.disableSoftReset}
									onChange={(event, checked) =>
										handleChange(
											"disableSoftReset",
											checked,
										)
									}
								/>
							}
						/>
						<Typography variant="body2">
							{_(
								"You can try this if the adapter does not start after updating to 2.3 or higher.",
							)}
							&nbsp;
							<a
								href={
									language === "de"
										? "https://github.com/AlCalzone/ioBroker.zwave2/blob/master/docs/de/bei-problemen.md#der-adapter-startet-nach-update-auf-version-23-oder-höher-nicht"
										: "https://github.com/AlCalzone/ioBroker.zwave2/blob/master/docs/en/troubleshooting.md#the-adapter-does-not-start-after-updating-to-version-23-or-higher"
								}
								target="_blank"
							>
								{_("But read this first!")}
							</a>
							{}
						</Typography>
					</Grid>

					<Grid item xs>
						<FormControlLabel
							label={_("Write a detailed logfile")}
							control={
								<Checkbox
									checked={settings.writeLogFile}
									onChange={(event, checked) =>
										handleChange("writeLogFile", checked)
									}
								/>
							}
						/>
						<Typography variant="body2">
							{_(
								"This should only be set for debugging purposes.",
							)}
						</Typography>
					</Grid>

					<Grid item xs>
						<FormControlLabel
							label={_("Preserve state names")}
							control={
								<Checkbox
									checked={settings.preserveStateNames}
									onChange={(event, checked) =>
										handleChange(
											"preserveStateNames",
											checked,
										)
									}
								/>
							}
						/>
					</Grid>

					<Grid item xs>
						<FormControlLabel
							label={
								<>
									{_("Legacy switch compatibility")}{" "}
									<TooltipIcon
										tooltip={_("switch compat tooltip")}
									/>
								</>
							}
							control={
								<Checkbox
									checked={settings.switchCompat}
									onChange={(event, checked) =>
										handleChange("switchCompat", checked)
									}
								/>
							}
						/>
					</Grid>
				</Grid>

				<Grid item xs={12} sm={7} className={classes.keyGrid}>
					<Typography
						variant="body1"
						className={classes.keyGridLabel}
					>
						{_("Network keys for secure communication")}
						<TooltipIcon tooltip={_("network key tooltip")} />
					</Typography>

					{networkKeyFields.map(
						([securityClass, property, label]) => (
							<Fragment key={`security-class-${securityClass}`}>
								<TextField
									className={classes.keyGrid_TextField}
									label={label}
									inputProps={{
										maxLength: 32,
										style: {
											fontFamily: "monospace",
										},
										onPaste: handleNetworkKeyPaste.bind(
											undefined,
											property,
										),
									}}
									fullWidth={true}
									InputLabelProps={{
										// Avoid overlapping the text if it was filled out
										shrink: !!settings[property],
									}}
									value={settings[property]}
									onChange={(event) =>
										handleChange(
											property,
											event.target.value,
										)
									}
									onBlur={() => validateNetworkKey(property)}
								/>

								<Button
									className={classes.keyGrid_Button}
									variant="contained"
									color="primary"
									startIcon={<SyncIcon />}
									onClick={() => generateNetworkKey(property)}
									style={{ whiteSpace: "nowrap" }}
								>
									{_("Generate key")}
								</Button>
							</Fragment>
						),
					)}
				</Grid>
			</Grid>

			<UpdateDeviceConfig />
		</div>
	);
});

const migrateSettings = (settings: ioBroker.AdapterConfig) => {
	if (settings.networkKey) {
		settings.networkKey_S0 = settings.networkKey;
		delete settings.networkKey;
	}
};

const translations: Translations = {
	en: require("./i18n/en.json"),
	de: require("./i18n/de.json"),
	ru: require("./i18n/ru.json"),
	pt: require("./i18n/pt.json"),
	nl: require("./i18n/nl.json"),
	fr: require("./i18n/fr.json"),
	it: require("./i18n/it.json"),
	es: require("./i18n/es.json"),
	pl: require("./i18n/pl.json"),
	"zh-cn": require("./i18n/zh-cn.json"),
};

const Root: React.FC = () => {
	return (
		<SettingsApp
			name="zwave2"
			afterLoad={migrateSettings}
			translations={translations}
		>
			<SettingsPageContent />
		</SettingsApp>
	);
};

ReactDOM.render(<Root />, document.getElementById("root"));
