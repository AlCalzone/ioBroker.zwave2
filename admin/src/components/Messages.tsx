import React from "react";
import { useI18n } from "iobroker-react/hooks";
import Typography from "@material-ui/core/Typography";

const Base: React.FC = (props) => {
	return (
		<Typography variant="body1" style={{ textAlign: "center" }}>
			{props.children}
		</Typography>
	);
};

export const NotRunning: React.FC = () => {
	const { translate: _ } = useI18n();
	return <Base>{_("adapter not ready")}</Base>;
};

export const NoDevices: React.FC = () => {
	const { translate: _ } = useI18n();
	return <Typography>{_("No devices present")}</Typography>;
	return <Base>{_("No devices present")}</Base>;
};

export const NodeNotReady: React.FC = () => {
	const { translate: _ } = useI18n();
	return <Base>{_("Node is not ready")}</Base>;
};
