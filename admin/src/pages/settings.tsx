import * as React from "react";

import { Tooltip } from "iobroker-react-components";
import { Dropdown } from "../components/dropdown";
import { composeObject, entries } from "alcalzone-shared/objects";

export type OnSettingsChangedCallback = (
	newSettings: Record<string, unknown>,
) => void;

interface SettingsProps {
	onChange: OnSettingsChangedCallback;
	settings: Record<string, unknown>;
}

interface SettingsState {
	[key: string]: unknown;
	serialport?: string;
	writeLogFile?: boolean;
	_serialports?: string[];
	networkKey?: string;
}

interface LabelProps {
	for: string;
	text: string;
	class?: string[];
	tooltip?: string;
}

/** Helper component for a settings label */
function Label(props: LabelProps) {
	const classNames: string[] = props.class || [];
	return (
		<label htmlFor={props.for} className={classNames.join(" ")}>
			{_(props.text)}
			{props.tooltip != null && <Tooltip text={props.tooltip} />}
		</label>
	);
}

interface CheckboxLabelProps {
	text: string;
	class?: string[];
	tooltip?: string;
}

/** Inner label for a Materializes CSS checkbox (span, no for property) */
function CheckboxLabel(props: CheckboxLabelProps) {
	const classNames: string[] = props.class || [];
	return (
		<span className={classNames.join(" ")}>
			{_(props.text)}
			{props.tooltip != null && <Tooltip text={props.tooltip} />}
		</span>
	);
}

export class Settings extends React.Component<SettingsProps, SettingsState> {
	constructor(props: SettingsProps) {
		super(props);
		// settings are our state
		this.state = {
			...props.settings,
		};

		// setup change handlers
		this.handleChange = this.handleChange.bind(this);
		this.validateNetworkKey = this.validateNetworkKey.bind(this);
		this.handleNetworkKeyPaste = this.handleNetworkKeyPaste.bind(this);
		this.generateNetworkKey = this.generateNetworkKey.bind(this);
	}

	private chkWriteLogFile: HTMLInputElement | null | undefined;

	private parseChangedSetting(
		target: HTMLInputElement | HTMLSelectElement,
	): unknown {
		// Checkboxes in MaterializeCSS are messed up, so we attach our own handler
		// However that one gets called before the underlying checkbox is actually updated,
		// so we need to invert the checked value here
		return target.type === "checkbox"
			? !(target as any).checked
			: target.type === "number"
			? parseInt(target.value, 10)
			: target.value;
	}

	// gets called when the form elements are changed by the user
	private handleChange(event: React.FormEvent<HTMLElement>) {
		const target = event.target as HTMLInputElement | HTMLSelectElement; // TODO: more types
		const value = this.parseChangedSetting(target);
		return this.doHandleChange(target.id, value);
	}

	private doHandleChange(setting: string, value: unknown): boolean {
		// store the setting
		this.putSetting(setting, value, () => {
			// and notify the admin UI about changes
			this.props.onChange(
				composeObject(
					entries(this.state).filter(([k, v]) => !k.startsWith("_")),
				),
			);
		});
		return false;
	}

	private handleNetworkKeyPaste(e) {
		// Stop data actually being pasted
		e.stopPropagation();
		e.preventDefault();

		// Get pasted data via clipboard API
		// @ts-ignore
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
		this.doHandleChange("networkKey", pastedData);
	}

	private generateNetworkKey() {
		if (
			!this.props.settings.networkKey ||
			this.state.networkKey !== this.props.settings.networkKey ||
			confirm(_("network key confirm"))
		) {
			const bytes = new Uint8Array(16);
			window.crypto.getRandomValues(bytes);
			const hexKey = [...bytes]
				.map((x) => x.toString(16).padStart(2, "0"))
				.join("");
			this.doHandleChange("networkKey", hexKey);
		}
	}

	private validateNetworkKey() {
		const networkKey = this.state.networkKey;
		if (!networkKey) return;
		if (!/[0-9a-fA-F]{32}/.test(networkKey)) {
			alert(_("Invalid network key"));
			// reset
			this.doHandleChange("networkKey", this.props.settings.networkKey);
		}
	}

	/**
	 * Reads a setting from the state object and transforms the value into the correct format
	 * @param key The setting key to lookup
	 */
	private getSetting(key: string, defaultValue?: unknown): unknown {
		const ret = this.state[key];
		return ret != undefined ? ret : defaultValue;
	}
	/**
	 * Saves a setting in the state object and transforms the value into the correct format
	 * @param key The setting key to store at
	 */
	private putSetting(
		key: string,
		value: unknown,
		callback?: () => void,
	): void {
		this.setState({ [key]: value }, callback);
	}

	public componentDidMount() {
		// update floating labels in materialize design
		M.updateTextFields();

		// Fix materialize checkboxes
		if (this.chkWriteLogFile != null) {
			$(this.chkWriteLogFile).on("click", this.handleChange as any);
		}

		// Try to retrieve a list of serial ports
		sendTo(null, "getSerialPorts", null, ({ error, result }) => {
			if (error) {
				console.error(error);
			} else if (result && result.length) {
				this.setState({ _serialports: result });
			}
		});
	}

	public componentWillUnmount() {
		// Fix materialize checkboxes
		if (this.chkWriteLogFile != null) {
			$(this.chkWriteLogFile).off("click", this.handleChange as any);
		}
	}

	public componentDidUpdate() {
		// update floating labels in materialize design
		M.updateTextFields();
	}

	public render() {
		// Add the currently configured serial port to the list if it is not in there
		const serialports = this.state._serialports;
		if (
			serialports &&
			this.state.serialport &&
			!serialports.includes(this.state.serialport)
		) {
			serialports.unshift(this.state.serialport);
		}
		return (
			<>
				<div className="row">
					<div className="col s4 input-field">
						{serialports && serialports.length ? (
							<Dropdown
								id="serialport"
								options={serialports}
								checkedOption={this.state.serialport}
								emptySelectionText={_("none selected")}
								checkedChanged={(newValue) =>
									this.doHandleChange("serialport", newValue)
								}
							/>
						) : (
							<input
								className="value"
								id="serialport"
								type="text"
								value={this.getSetting("serialport") as any}
								onChange={this.handleChange}
							/>
						)}
						<Label for="serialport" text="Select serial port" />
					</div>
					<div className="col s5 input-field">
						<input
							className="value"
							id="networkKey"
							type="text"
							value={this.getSetting("networkKey") as any}
							onChange={this.handleChange}
							onBlur={this.validateNetworkKey}
							onPaste={this.handleNetworkKeyPaste}
							style={{ fontFamily: "monospace" }}
							maxLength={32}
						/>
						<Label
							for="networkKey"
							text="Network key for secure communication"
							tooltip="network key tooltip"
						/>
					</div>
					<div className="col s3 input-field">
						<a
							className="waves-effect waves-light btn"
							onClick={this.generateNetworkKey}
						>
							<i className="material-icons tiny left">loop</i>
							{_("Generate key")}
						</a>
					</div>
				</div>
				<div className="row">
					<div className="col s6">
						<label htmlFor="writeLogFile">
							<input
								type="checkbox"
								className="value"
								id="writeLogFile"
								defaultChecked={
									this.getSetting("writeLogFile") as any
								}
								ref={(me) => (this.chkWriteLogFile = me)}
							/>
							<CheckboxLabel text="Write a detailed logfile" />
						</label>
						<br />
						<span>
							{_(
								"This should only be set for debugging purposes.",
							)}
						</span>
					</div>
				</div>
			</>
		);
	}
}
