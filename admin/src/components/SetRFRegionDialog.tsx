import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Dropdown } from "iobroker-react/components";
import { useI18n } from "iobroker-react/hooks";
import { useMemo, useState } from "react";
import type { RFRegion } from "zwave-js";

export interface SetRFRegionDialogContentProps {
	open: boolean;
	region: RFRegion;
	regions: Record<string, string>;
	onCancel: () => void;
	onConfirm: (region: RFRegion) => void;
}

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexFlow: "column",
		maxWidth: 400,
		gap: theme.spacing(2),
	},
}));

export const SetRFRegionDialog: React.FC<SetRFRegionDialogContentProps> = (
	props,
) => {
	const { translate: _ } = useI18n();

	const classes = useStyles();

	const [region, setRegion] = useState<RFRegion>(props.region);

	const options = useMemo(() => {
		return Object.entries(props.regions).map(([key, value]) => ({
			value: key,
			label: value,
		}));
	}, [props.regions]);

	return (
		<Dialog open={props.open} onClose={props.onCancel} maxWidth={false}>
			<DialogTitle id="alert-dialog-title">
				{_("Set RF Region")}
			</DialogTitle>
			<DialogContent className={classes.root}>
				<Typography variant="body1">
					{_(
						"Select the correct region for where you are. Using a different region may be illegal.",
					)}
				</Typography>
				<Dropdown
					selectedOption={region}
					options={options}
					onChange={(event) =>
						setRegion(parseInt(event.target.value as string))
					}
				/>
				<Typography variant="body2">
					{_(
						"Note: Applying a different region might take a few seconds.",
					)}
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button
					disabled={props.region === region}
					onClick={() => props.onConfirm(region)}
					color="primary"
				>
					{_("OK")}
				</Button>
				<Button onClick={props.onCancel} color="primary">
					{_("Cancel")}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
