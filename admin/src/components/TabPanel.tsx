import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

const useStyles = makeStyles((_theme) => ({
	tabpanel: {
		flex: 1,
		position: "relative",
		"& > *": {
			width: "100%",
			height: "100%",
		},
	},
}));

export const TabPanel: React.FC<TabPanelProps> = (props) => {
	const { children, value, index, ...other } = props;
	const classes = useStyles();

	return (
		<div
			className={classes.tabpanel}
			role="tabpanel"
			hidden={value !== index}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
};
