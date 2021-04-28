import * as React from "react";

export const NotRunning: React.FC = () => {
	return <div className="notRunning">{_("adapter not ready")}</div>;
};

export const NoDevices: React.FC = () => {
	return <p style={{ textAlign: "center" }}>{_("No devices present")}</p>;
};

export const NodeNotReady: React.FC = () => {
	return <p style={{ textAlign: "center" }}>{_("Node is not ready")}</p>;
};
