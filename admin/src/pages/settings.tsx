import * as React from "react";

import { Tooltip } from "iobroker-react-components";

export type OnSettingsChangedCallback = (
	newSettings: Record<string, unknown>,
) => void;

interface SettingsProps {
	onChange: OnSettingsChangedCallback;
	settings: Record<string, unknown>;
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

export class Settings extends React.Component<
	SettingsProps,
	Record<string, unknown>
> {
	constructor(props: SettingsProps) {
		super(props);
		// settings are our state
		this.state = {
			...props.settings,
		};

		// setup change handlers
		this.handleChange = this.handleChange.bind(this);
	}

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
		const target = event.target as (HTMLInputElement | HTMLSelectElement); // TODO: more types
		const value = this.parseChangedSetting(target);

		// store the setting
		this.putSetting(target.id, value, () => {
			// and notify the admin UI about changes
			this.props.onChange(this.state);
		});

		return false;
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
	}

	public render() {
		return (
			<>
				<div className="row">
					<div className="col s4 input-field">
						<Label for="serialport" text="Select serial port" />
						<input
							className="value"
							id="serialport"
							type="text"
							value={this.getSetting("serialport") as any}
							onChange={this.handleChange}
						/>
					</div>
				</div>
			</>
		);
	}
}
