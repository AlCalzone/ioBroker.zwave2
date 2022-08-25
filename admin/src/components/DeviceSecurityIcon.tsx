import { amber, blue, deepPurple, green, grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import LockIcon from "@material-ui/icons/Lock";
import NoEncryptionIcon from "@material-ui/icons/NoEncryption";
import clsx from "clsx";

const useStyles = makeStyles((_theme) => ({
	root: {
		display: "grid",
		gridTemplateColumns: "repeat(4, 16px)",
		gridTemplateRows: "16px",
	},
	securityIcon: {
		fontSize: "16px",
		color: grey[200],
	},
	S2_AccessControl: {
		color: green[800],
	},
	S2_Authenticated: {
		color: blue[900],
	},
	S2_Unauthenticated: {
		color: deepPurple[500],
	},
	S0_Legacy: {
		color: amber[800],
	},
}));

interface SecurityClassIconProps {
	title: string;
	className: string;
	supported: boolean;
	granted: boolean;
}

const SecurityClassIcon: React.FC<SecurityClassIconProps> = (props) => {
	const classes = useStyles();

	const Icon = props.granted ? LockIcon : NoEncryptionIcon;

	return props.supported ? (
		<Tooltip title={`${props.title}: ${props.granted ? "✔" : "✘"}`}>
			<Icon
				className={clsx(
					classes.securityIcon,
					props.granted && classes[props.className],
				)}
			/>
		</Tooltip>
	) : (
		<span></span>
	);
};

interface DeviceSecurityIconProps {
	securityClasses: Record<number, boolean>;
}

const secClassDefinitions = [
	["S2_AccessControl", "S2 Access Control"],
	["S2_Authenticated", "S2 Authenticated"],
	["S2_Unauthenticated", "S2 Unauthenticated"],
	["S0_Legacy", "S0 Legacy"],
] as const;

export const DeviceSecurityIcon: React.FC<DeviceSecurityIconProps> = (
	props,
) => {
	const classes = useStyles();
	const { securityClasses } = props;

	return (
		<div className={classes.root}>
			{secClassDefinitions.map(([className, title]) => (
				<SecurityClassIcon
					key={className}
					title={title}
					className={className}
					supported={className in securityClasses}
					granted={securityClasses[className] === true}
				/>
			))}
		</div>
	);
};
