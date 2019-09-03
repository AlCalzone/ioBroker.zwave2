// Renders some components in jQuery UI tabs
import * as React from "react";
import { isObject, isArray } from "alcalzone-shared/typeguards";
import { composeObject } from "alcalzone-shared/objects";

const M_Select = M.FormSelect || ((M as any).Select as typeof M.FormSelect);

export interface DropdownProps {
	id?: string;
	emptySelectionText?: string;
	options: { [key: string]: string } | string[];
	checkedOption?: string;
	checkedChanged: (selected: string) => void;
}

export class Dropdown extends React.Component<DropdownProps> {
	private static defaultProps = {
		emptySelectionText: "Select an option",
		checkedOption: undefined,
	};

	constructor(props: DropdownProps) {
		super(props);
		this.readStateFromUI = this.readStateFromUI.bind(this);
	}

	private dropdown: HTMLSelectElement | null | undefined;
	private mcssSelect: M_Select | null | undefined;

	public componentDidMount() {
		if (this.dropdown != null) {
			$(this.dropdown).on("change", this.readStateFromUI);

			this.mcssSelect =
				M_Select.getInstance(this.dropdown) ||
				new M_Select(this.dropdown);
		}
	}

	public componentWillUnmount() {
		if (this.dropdown != null) {
			$(this.dropdown).off("change", this.readStateFromUI);
		}
	}

	private readStateFromUI(event: React.FormEvent<HTMLSelectElement>) {
		if (!this.mcssSelect) return;
		// update the adapter settings
		this.props.checkedChanged(event.target.value);
	}

	public render() {
		const options = isArray(this.props.options)
			? composeObject(this.props.options.map(o => [o, o]))
			: isObject(this.props.options)
			? this.props.options
			: {};
		return (
			<select
				id={this.props.id}
				ref={me => (this.dropdown = me)}
				defaultValue={this.props.checkedOption || ""}
			>
				<option value="" disabled>
					{this.props.emptySelectionText}
				</option>
				{Object.keys(options).map(k => (
					<option key={k} value={k}>
						{options[k]}
					</option>
				))}
			</select>
		);
	}
}
