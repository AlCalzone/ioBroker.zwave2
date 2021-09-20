import React from "react";
import ReactDOM from "react-dom";
import { IoBrokerApp } from "iobroker-react/app";
import type { Translations } from "iobroker-react/i18n";

import { ErrorBoundary } from "react-error-boundary";
import { ZWaveLogs } from "./pages/ZWaveLogs";

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
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<ZWaveLogs />
		</ErrorBoundary>
	);
});

ReactDOM.render(
	<IoBrokerApp name={"zwave2"} translations={translations}>
		<Root />
	</IoBrokerApp>,
	document.getElementById("root"),
);
