import { AppBar, Tab, Tabs } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import { IoBrokerApp } from "iobroker-react/app";
import type { Translations } from "iobroker-react/i18n";
import { TabPanel } from "./components/TabPanel";
import { Associations } from "./pages/_associations";
import { Devices } from "./pages/_devices";
import { NetworkMap } from "./pages/_networkMap";
import { useI18n } from "iobroker-react/hooks";

import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }) {
	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre>{error.stack}</pre>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	);
}

const translations: Translations = {
	en: require("./i18n/en.json"),
	de: require("./i18n/de.json"),
	ru: require("./i18n/ru.json"),
	pt: require("./i18n/pt.json"),
	nl: require("./i18n/nl.json"),
	fr: require("./i18n/fr.json"),
	it: require("./i18n/it.json"),
	es: require("./i18n/es.json"),
	pl: require("./i18n/pl.json"),
	"zh-cn": require("./i18n/zh-cn.json"),
};

const Root: React.FC = React.memo(() => {
	const [value, setValue] = React.useState(0);
	const { translate: _ } = useI18n();

	// eslint-disable-next-line @typescript-eslint/ban-types
	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	return (
		<>
			<AppBar position="static">
				<Tabs value={value} onChange={handleChange}>
					<Tab label={_("Devices")} />
					<Tab label={_("Associations")} />
					<Tab label={_("Network map")} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<ErrorBoundary FallbackComponent={ErrorFallback}>
					<Devices />
				</ErrorBoundary>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<ErrorBoundary FallbackComponent={ErrorFallback}>
					<Associations />
				</ErrorBoundary>
			</TabPanel>
			<TabPanel value={value} index={2}>
				<ErrorBoundary FallbackComponent={ErrorFallback}>
					<NetworkMap />
				</ErrorBoundary>
			</TabPanel>
		</>
	);
});

ReactDOM.render(
	<IoBrokerApp name="zwave2" translations={translations}>
		<Root />
	</IoBrokerApp>,
	document.getElementById("root"),
);
