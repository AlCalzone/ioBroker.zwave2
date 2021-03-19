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

interface DropdownState {
	checkedOption?: string;
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
	private static defaultProps = {
		emptySelectionText: "Select an option",
		checkedOption: undefined,
	};

	constructor(props: DropdownProps) {
		super(props);
		this.readStateFromUI = this.readStateFromUI.bind(this);
		this.state = {
			checkedOption: props.checkedOption,
		};
	}

	private dropdown: HTMLSelectElement | null | undefined;
	private mcssSelect: M.FormSelect | null | undefined;

	public componentDidMount() {
		if (this.dropdown != null) {
			$(this.dropdown).on("change", this.readStateFromUI as any);

			this.mcssSelect =
				M_Select.getInstance(this.dropdown) ||
				new M_Select(this.dropdown);
		}
	}

	public componentDidUpdate(prevProps: DropdownProps, _prevState: any) {
		if (!this.dropdown) return;
		if (prevProps.options !== this.props.options) {
			this.mcssSelect = new M_Select(this.dropdown);
		}
		if (prevProps.checkedOption !== this.props.checkedOption) {
			this.setState((_, props) => ({
				checkedOption: props.checkedOption,
			}));
		}
	}

	public componentWillUnmount() {
		if (this.dropdown != null) {
			$(this.dropdown).off("change", this.readStateFromUI as any);
		}
	}

	private readStateFromUI(event: React.FormEvent<HTMLSelectElement>) {
		if (!this.mcssSelect) return;
		// update the adapter settings
		this.setState({
			checkedOption: (event.target as any).value,
		});
		this.props.checkedChanged((event.target as any).value);
	}

	public render() {
		const options = isArray(this.props.options)
			? composeObject(this.props.options.map((o) => [o, o]))
			: isObject(this.props.options)
			? this.props.options
			: {};
		return (
			<select
				id={this.props.id}
				ref={(me) => (this.dropdown = me)}
				value={this.state.checkedOption ?? ""}
			>
				<option value="" disabled>
					{this.props.emptySelectionText}
				</option>
				{Object.keys(options).map((k) => (
					<option key={k} value={k}>
						{options[k]}
					</option>
				))}
			</select>
		);
	}
}
