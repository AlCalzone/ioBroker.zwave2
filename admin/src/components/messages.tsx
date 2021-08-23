import React from "react";
import { useI18n } from "iobroker-react/hooks";

export const NotRunning: React.FC = () => {
	const { translate: _ } = useI18n();
	return <div className="notRunning">{_("adapter not ready")}</div>;
};

export const NoDevices: React.FC = () => {
	const { translate: _ } = useI18n();
	return <p style={{ textAlign: "center" }}>{_("No devices present")}</p>;
};

export const NodeNotReady: React.FC = () => {
	const { translate: _ } = useI18n();
	return <p style={{ textAlign: "center" }}>{_("Node is not ready")}</p>;
};
