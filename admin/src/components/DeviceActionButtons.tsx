import Button from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import PlusIcon from "@material-ui/icons/Add";
import NetworkCheckIcon from "@material-ui/icons/NetworkCheck";
import MinusIcon from "@material-ui/icons/Remove";
import clsx from "clsx";
import { useI18n } from "iobroker-react/hooks";

interface DeviceActionButtonsProps {
	state: DeviceActionButtonsState;
	beginInclusion: () => void;
	beginExclusion: () => void;
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
	redButton: {
		background: theme.palette.error.main,
		"&:hover": {
			background: theme.palette.error.dark,
		},
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
				onClick={props.beginExclusion}
			>
				{props.state !== DeviceActionButtonsState.Excluding
					? _("Exclude device")
					: _("Exclusion active")}
			</Button>
			<Button
				variant="contained"
				color={"primary"}
				className={clsx(
					props.state === DeviceActionButtonsState.Healing &&
						classes.redButton,
				)}
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
