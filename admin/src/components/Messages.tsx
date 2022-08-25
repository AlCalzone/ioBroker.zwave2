import Typography from "@material-ui/core/Typography";
import { useI18n } from "iobroker-react/hooks";

export const Message: React.FC = (props) => {
	return (
		<Typography variant="body1" style={{ textAlign: "center" }}>
			{props.children}
		</Typography>
	);
};

export const NotRunning: React.FC = () => {
	const { translate: _ } = useI18n();
	return <Message>{_("adapter not ready")}</Message>;
};

export const NoDevices: React.FC = () => {
	const { translate: _ } = useI18n();
	return <Message>{_("No devices present")}</Message>;
};

export const NodeNotReady: React.FC = () => {
	const { translate: _ } = useI18n();
	return <Message>{_("Node is not ready")}</Message>;
};
