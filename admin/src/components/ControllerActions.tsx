import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useAPI } from "../lib/useAPI";
import { useDialogs, useI18n } from "iobroker-react/hooks";
import { Typography } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import LanguageIcon from "@material-ui/icons/Language";
import { getErrorMessage } from "../../../src/lib/shared";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(2, 0),
		display: "grid",
		gridTemplateColumns: "auto 1fr",
		alignItems: "center",
		columnGap: theme.spacing(4),
		rowGap: theme.spacing(2),
	},
}));

export interface ControllerActionsProps {
	isBusy: boolean;
	setBusy: (isBusy: boolean) => void;
}

export const ControllerActions: React.FC<ControllerActionsProps> = (props) => {
	const { isBusy, setBusy } = props;
	const api = useAPI();
	const { translate: _ } = useI18n();
	const { showModal, showNotification } = useDialogs();

	const softReset = React.useCallback(() => {
		setBusy(true);
		api.softReset().finally(() => setBusy(false));
	}, [api, setBusy]);

	const clearCache = React.useCallback(async () => {
		if (isBusy) return;

		try {
			const result = await showModal(
				_("Clear cache?"),
				_("clear cache procedure"),
			);
			if (!result) return;
			setBusy(true);
			await api.clearCache();
			setTimeout(() => {
				setBusy(false);
			}, 1000);
		} catch (e) {
			showNotification(getErrorMessage(e), "error");
			return;
		}
	}, [api, isBusy, showModal, showNotification]);

	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Button
				disabled={isBusy}
				variant="contained"
				color="primary"
				onClick={softReset}
				startIcon={<PowerSettingsNewIcon />}
			>
				{_("Soft reset")}
			</Button>
			<Typography variant="body2">
				{_("Restart the controller, e.g. when it hangs")}
			</Typography>

			<Button
				disabled={isBusy}
				variant="contained"
				color="primary"
				onClick={clearCache}
				startIcon={<RestorePageIcon />}
			>
				{_("Re-interview all")}
			</Button>
			<Typography variant="body2">
				{_(
					"Forget all information about all nodes and re-interview them. Battery-powered nodes might need to be woken up manually.",
				)}
			</Typography>

			<Button
				disabled={isBusy}
				variant="contained"
				color="primary"
				onClick={() => void 0 /* TODO */}
				startIcon={<LanguageIcon />}
			>
				{_("Set RF Region")}
			</Button>
			<Typography variant="body2">
				{_(
					"Configure the region and radio frequencies of the controller.",
				)}
			</Typography>

			<Button
				disabled={isBusy}
				variant="contained"
				color="primary"
				onClick={() => void 0 /* TODO */}
				startIcon={<DeleteForeverIcon />}
			>
				{_("Factory reset")}
			</Button>
			<Typography variant="body2">
				{_(
					"Wipes all configuration of the controller. All connected nodes will be orphaned and have to be reset and included into the new network before they can be used again.",
				)}
			</Typography>
		</div>
	);
};
