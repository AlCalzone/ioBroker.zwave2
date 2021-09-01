import Button from "@material-ui/core/Button";
import React from "react";
import PlusIcon from "@material-ui/icons/Add";
import MinusIcon from "@material-ui/icons/Remove";
import NetworkCheckIcon from "@material-ui/icons/NetworkCheck";
import { useI18n } from "iobroker-react/hooks";
import { makeStyles, Theme } from "@material-ui/core/styles";

interface DeviceActionButtonsProps {
	state: DeviceActionButtonsState;
	beginInclusion: () => void;
	// cancelInclusion: () => void;
	beginExclusion: () => void;
	cancelExclusion: () => void;
	healNetwork: () => void;
	cancelHealing: () => void;
}

export enum DeviceActionButtonsState {
	Idle = 0,
	Including,
	Excluding,
	Healing,
	Busy,
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		display: "flex",
		flexDirection: "row",
		gap: theme.spacing(1),
	},
}));

export const DeviceActionButtons: React.FC<DeviceActionButtonsProps> = (
	props,
) => {
	const { translate: _ } = useI18n();
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Button
				variant="contained"
				color={
					props.state === DeviceActionButtonsState.Including
						? "secondary"
						: "primary"
				}
				startIcon={<PlusIcon />}
				disabled={
					props.state !== DeviceActionButtonsState.Idle &&
					props.state !== DeviceActionButtonsState.Including
				}
				onClick={props.beginInclusion}
			>
				{props.state !== DeviceActionButtonsState.Including
					? _("Include device")
					: _("Inclusion active")}
			</Button>
			<Button
				variant="contained"
				color={
					props.state === DeviceActionButtonsState.Excluding
						? "secondary"
						: "primary"
				}
				startIcon={<MinusIcon />}
				disabled={
					props.state !== DeviceActionButtonsState.Idle &&
					props.state !== DeviceActionButtonsState.Excluding
				}
				onClick={
					props.state !== DeviceActionButtonsState.Excluding
						? props.beginExclusion
						: props.cancelExclusion
				}
			>
				{props.state !== DeviceActionButtonsState.Excluding
					? _("Exclude device")
					: _("Cancel exclusion")}
			</Button>
			<Button
				variant="contained"
				color={
					props.state === DeviceActionButtonsState.Healing
						? "secondary"
						: "primary"
				}
				startIcon={<NetworkCheckIcon />}
				disabled={
					props.state !== DeviceActionButtonsState.Idle &&
					props.state !== DeviceActionButtonsState.Healing
				}
				onClick={
					props.state !== DeviceActionButtonsState.Healing
						? props.healNetwork
						: props.cancelHealing
				}
			>
				{props.state !== DeviceActionButtonsState.Healing
					? _("Heal network")
					: _("Cancel healing")}
			</Button>
		</div>
	);
};
