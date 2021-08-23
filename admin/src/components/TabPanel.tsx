import Box from "@material-ui/core/Box";
import React from "react";

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

export const TabPanel: React.FC<TabPanelProps> = (props) => {
	const { children, value, index, ...other } = props;

	return (
		<div role="tabpanel" hidden={value !== index} {...other}>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
};
