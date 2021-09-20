import LaunchIcon from "@material-ui/icons/Launch";
import React from "react";
import { useAPI } from "../lib/useAPI";
import { usePush } from "../lib/usePush";
import type { PushMessage } from "../../../src/lib/shared";
import ansi from "ansicolor";
import { makeStyles } from "@material-ui/core/styles";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import GetAppIcon from "@material-ui/icons/GetApp";
import LockIcon from "@material-ui/icons/Lock";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { useGlobals, useI18n } from "iobroker-react/hooks";
import clsx from "clsx";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexFlow: "column nowrap",
		alignItems: "stretch",
		gap: theme.spacing(2),
	},
	root_window: {
		height: "100%",
		padding: theme.spacing(2),
	},
	root_embedded: {
		height: `calc(100% - ${theme.spacing(12)}px)`,
	},
	buttons: {
		flex: "0 1 auto",
		display: "flex",
		gap: theme.spacing(1),
	},
	code: {
		display: "block",
		flex: 1,
		background: "#1e1e1e",
		color: "#cccccc",
		overflow: "auto",
		padding: theme.spacing(2),
		"& > pre": {
			margin: 0,
		},
	},
}));

ansi.rgb.blue = [36, 114, 200];
ansi.rgb.cyan = [17, 168, 205];
ansi.rgb.green = [13, 188, 121];

const AutoScroll: React.FC = () => {
	const elementRef = React.useRef<HTMLDivElement>(null);
	React.useEffect(() =>
		elementRef.current?.scrollIntoView({
			behavior: "smooth",
		}),
	);
	return <div ref={elementRef} />;
};

export const ZWaveLogs: React.FC = () => {
	const classes = useStyles();
	const api = useAPI();
	const { translate: _ } = useI18n();
	const { instance } = useGlobals();

	const [logs, setLogs] = React.useState("");
	const [enabled, setEnabled] = React.useState(false);
	const [autoScroll, setAutoScroll] = React.useState(true);

	const onPush = React.useCallback(
		(payload: PushMessage) => {
			if (payload.type === "log") {
				console.log(payload.info.message);
				const pseudoHtml = ansi.parse(payload.info.message).spans;
				const spans = pseudoHtml.map((span) => {
					return `<span style="${span.css.replace(
						/^background:/,
						"color:#1e1e1e;background:",
					)}">${span.text}</span>`;
				});
				setLogs(
					(logs) => logs + (logs ? "<br />" : "") + spans.join(""),
				);
			}
		},
		[setLogs],
	);
	usePush(onPush);

	// Enable subscribing and unsubscribing
	const subscribeLogs = React.useCallback(() => {
		if (enabled) return;
		api.subscribeLogs().then(() => {
			setLogs(
				(logs) =>
					logs + (logs ? "<br />" : "") + _("Subscribed to logs..."),
			);
			setEnabled(true);
		});
	}, [api, enabled]);
	const unsubscribeLogs = React.useCallback(() => {
		if (!enabled) return;
		api.unsubscribeLogs().then(() => {
			setLogs(
				(logs) =>
					logs + (logs ? "<br />" : "") + _("Unsubscribed logs..."),
			);
			setEnabled(false);
		});
	}, [api, enabled]);

	React.useEffect(() => {
		subscribeLogs();
		return unsubscribeLogs;
	}, []);

	// Enable downloading
	const downloadLogs = React.useCallback(() => {
		const element = document.createElement("a");
		const plaintext = logs
			.replace(/\<br.*?\>/gi, "\n")
			.replace(/\<.*?\>/g, "");
		const file = new Blob([plaintext], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = `zwave_${new Date()
			.toISOString()
			.replace("T", "_")
			.replace(/[:\.]/g, "-")
			.replace("Z", "")}.log`;
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
	}, [logs]);

	const openWindow = React.useCallback(() => {
		window.open(
			"log_window.html",
			`zwave_log_${instance}`,
			"innerWidth=960,innerHeight=600",
		);
	}, []);
	const isWindow = window.name.startsWith("zwave_log_");

	return (
		<div
			className={clsx(
				classes.root,
				isWindow ? classes.root_window : classes.root_embedded,
			)}
		>
			<div className={classes.buttons}>
				<ButtonGroup variant="contained" color="primary">
					<Tooltip title={_("Start logging")}>
						<Button disabled={enabled} onClick={subscribeLogs}>
							<PlayArrowIcon />
						</Button>
					</Tooltip>
					<Tooltip title={_("Pause logging")}>
						<Button disabled={!enabled} onClick={unsubscribeLogs}>
							<PauseIcon />
						</Button>
					</Tooltip>
				</ButtonGroup>
				<ButtonGroup variant="contained" color="primary">
					<Tooltip title={_("Auto-scroll to bottom")}>
						<Button
							disabled={autoScroll}
							onClick={() => setAutoScroll(true)}
						>
							<GetAppIcon />
						</Button>
					</Tooltip>
					<Tooltip title={_("Pause auto-scrolling")}>
						<Button
							disabled={!autoScroll}
							onClick={() => setAutoScroll(false)}
						>
							<LockIcon />
						</Button>
					</Tooltip>
				</ButtonGroup>
				<Button
					variant="contained"
					color="primary"
					onClick={downloadLogs}
					startIcon={<CloudDownloadIcon />}
				>
					{_("Download logs")}
				</Button>
				{!isWindow && (
					<Tooltip title={_("Open log in new window")}>
						<Button
							variant="contained"
							color="primary"
							style={{ marginLeft: "auto" }}
							onClick={openWindow}
						>
							<LaunchIcon />
						</Button>
					</Tooltip>
				)}
			</div>
			<code className={classes.code}>
				<pre dangerouslySetInnerHTML={{ __html: logs }}></pre>
				{autoScroll && <AutoScroll />}
			</code>
		</div>
	);
};
