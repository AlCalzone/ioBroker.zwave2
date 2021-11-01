import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import VideocamIcon from "@material-ui/icons/Videocam";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useAnimationFrame } from "../lib/useAnimationFrame";
import parseQR from "jsqr-es6";
import { useI18n } from "iobroker-react/hooks";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "auto",
		padding: theme.spacing(2),
		display: "inline-grid",
		gridTemplateColumns: "1fr auto",
		gridTemplateRows: "auto auto",
		gridGap: theme.spacing(1),
		alignItems: "center",
	},
	container: {
		flex: 0,
		width: 400,
		height: 400,
		display: "grid",
		overflow: "hidden",
		cursor: "pointer",
		"& > *": {
			width: 400,
			height: 400,
			gridRow: 1,
			gridColumn: 1,
		},
		"& img": {
			maxWidth: "100%",
		},
	},
	hoverOK: {
		border: `4px solid ${theme.palette.divider}`,
		borderStyle: "dashed",
		borderRadius: "8px",
	},
	hoverNOK: {
		cursor: "not-allowed",
	},
	label: {
		textAlign: "center",
		alignSelf: "center",
		lineHeight: "unset",
		height: "auto",
	},
}));

interface Point {
	x: number;
	y: number;
}

function drawCorner(
	ctx: CanvasRenderingContext2D,
	a: Point,
	b: Point,
	c: Point,
	size: number,
	color: string,
) {
	ctx.beginPath();
	const _a = {
		x: a.x + (b.x - a.x) * (1 - size),
		y: a.y + (b.y - a.y) * (1 - size),
	};
	const _c = {
		x: c.x + (b.x - c.x) * (1 - size),
		y: c.y + (b.y - c.y) * (1 - size),
	};

	ctx.moveTo(_a.x, _a.y);
	ctx.lineTo(b.x, b.y);
	ctx.lineTo(_c.x, _c.y);
	ctx.lineWidth = 4;
	ctx.strokeStyle = color;
	ctx.stroke();
}

export interface QRScannerVideoProps extends QRScannerProps {
	detectionAreaSize?: number;
}

export const QRScannerVideo: React.FC<QRScannerVideoProps> = (props) => {
	const { detectionAreaSize: detectionArea = 100 } = props;

	const classes = useStyles();
	const { translate: _ } = useI18n();

	const [active, setActive] = React.useState(false);
	const [failed, setFailed] = React.useState(false);
	const video = React.useRef<HTMLVideoElement>();

	const previewCanvasRef = React.useRef<HTMLCanvasElement>(null);
	const previewContextRef = React.useRef<CanvasRenderingContext2D>();
	const detectionCanvasRef = React.useRef<HTMLCanvasElement>(null);
	const detectionContextRef = React.useRef<CanvasRenderingContext2D>();

	const [qr, setQr] = React.useState<string>();
	React.useEffect(() => {
		if (qr) props.onDetect(qr);
	}, [qr]);

	React.useEffect(() => {
		if (!previewCanvasRef.current) return;
		previewContextRef.current =
			previewCanvasRef.current.getContext("2d") ?? undefined;
	}, [previewCanvasRef.current]);

	React.useEffect(() => {
		if (!detectionCanvasRef.current) return;
		detectionContextRef.current =
			detectionCanvasRef.current.getContext("2d") ?? undefined;
	}, [detectionCanvasRef.current]);

	useAnimationFrame(() => {
		if (
			!active ||
			!video.current ||
			!previewCanvasRef.current ||
			!previewContextRef.current ||
			!detectionCanvasRef.current ||
			!detectionContextRef.current
		) {
			return;
		}

		const v = video.current;
		const cP = previewCanvasRef.current;
		const ctxP = previewContextRef.current;
		const cD = detectionCanvasRef.current;
		const ctxD = detectionContextRef.current;

		if (v.readyState === v.HAVE_ENOUGH_DATA) {
			// Crop the preview to be square
			const size = Math.min(v.videoWidth, v.videoHeight);
			const scale = detectionArea / size;
			cP.height = size;
			cP.width = size;

			const [sxP, syP] = [
				(v.videoWidth - size) / 2,
				(v.videoHeight - size) / 2,
			];
			ctxP.drawImage(v, sxP, syP, size, size, 0, 0, cP.width, cP.height);

			// Highlight the detection area on the preview canvas
			ctxP.beginPath();
			ctxP.fillStyle = "rgba(255,255,255,0.15)";
			ctxP.rect(
				(size - detectionArea) / 2,
				(size - detectionArea) / 2,
				detectionArea,
				detectionArea,
			);
			ctxP.fill();

			const previewCorners = [
				{
					x: (size - detectionArea) / 2,
					y: (size - detectionArea) / 2,
				},
				{
					x: (size + detectionArea) / 2,
					y: (size - detectionArea) / 2,
				},
				{
					x: (size + detectionArea) / 2,
					y: (size + detectionArea) / 2,
				},
				{
					x: (size - detectionArea) / 2,
					y: (size + detectionArea) / 2,
				},
			];
			for (let i = 0; i < previewCorners.length; i++) {
				const b = previewCorners[i];
				const a =
					previewCorners[
						(i - 1 + previewCorners.length) % previewCorners.length
					];
				const c = previewCorners[(i + 1) % previewCorners.length];
				drawCorner(ctxP, a, b, c, 0.2, "rgba(255,255,255,0.5)");
			}

			// Draw the detection area onto the detection canvas in large
			cD.height = size;
			cD.width = size;
			const [sxD, syD] = [
				(v.videoWidth - detectionArea) / 2,
				(v.videoHeight - detectionArea) / 2,
			];
			ctxD.drawImage(
				v,
				sxD,
				syD,
				detectionArea,
				detectionArea,
				0,
				0,
				cD.width,
				cD.height,
			);

			const imageData = ctxD.getImageData(0, 0, cD.width, cD.height);
			const code = parseQR(
				imageData.data,
				imageData.width,
				imageData.height,
				{
					inversionAttempts: "dontInvert",
				},
			);
			if (code) {
				setQr(code.data);
				const corners = [
					code.location.topLeftCorner,
					code.location.topRightCorner,
					code.location.bottomRightCorner,
					code.location.bottomLeftCorner,
				].map((p) => ({
					x: p.x * scale + (size - detectionArea) / 2,
					y: p.y * scale + (size - detectionArea) / 2,
				}));
				for (let i = 0; i < corners.length; i++) {
					const b = corners[i];
					const a =
						corners[(i - 1 + corners.length) % corners.length];
					const c = corners[(i + 1) % corners.length];
					drawCorner(ctxP, a, b, c, 0.2, "green");
				}
			} else {
				setQr(undefined);
			}
		}
	}, [
		active,
		drawCorner,
		video.current,
		previewCanvasRef.current,
		previewContextRef.current,
		detectionCanvasRef.current,
		detectionContextRef.current,
		detectionArea,
	]);

	React.useEffect(() => {
		video.current = document.createElement("video");
		let stream: MediaStream | undefined;

		(async () => {
			try {
				stream = await navigator.mediaDevices
					// Attempt to get the back camera on phones
					.getUserMedia({ video: { facingMode: "environment" } });
			} catch {
				setFailed(true);
				return;
			}
			if (!video.current) return;
			video.current.srcObject = stream;
			video.current.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
			video.current.play();
			setActive(true);
		})();

		return () => {
			stream?.getTracks().forEach((track) => track.stop());
			video.current = undefined;
		};
	}, []);

	return (
		<div className={classes.container}>
			<Typography variant="body2" className={classes.label}>
				{failed ? _("failed to open camera") : _("opening camera...")}
			</Typography>
			<canvas ref={previewCanvasRef}></canvas>
			<canvas hidden ref={detectionCanvasRef}></canvas>
		</div>
	);
};

export type QRScannerImageProps = QRScannerProps;

export const QRScannerImage: React.FC<QRScannerImageProps> = (props) => {
	const classes = useStyles();
	const { translate: _ } = useI18n();

	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const imageRef = React.useRef<HTMLImageElement>(null);

	const handleLabelClick = React.useCallback(() => {
		fileInputRef.current?.click();
	}, [fileInputRef.current]);

	const [fileURL, setFileURL] = React.useState<string>();
	const handleFileChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			setFileURL(URL.createObjectURL(file));
		},
		[setFileURL],
	);
	const [failed, setFailed] = React.useState(false);

	const [dropState, setDropState] = React.useState<"idle" | "ok" | "nok">(
		"idle",
	);

	const handleDragOver = React.useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();

			if (e.dataTransfer.items?.length === 1) {
				const item = e.dataTransfer.items[0];
				if (item.kind === "file" && item.type.startsWith("image/")) {
					e.dataTransfer.dropEffect = "copy";
					setDropState("ok");
					return;
				}
			}
			e.dataTransfer.dropEffect = "none";
			setDropState("nok");
		},
		[setDropState],
	);
	const handleDragLeave = React.useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setDropState("idle");
		},
		[setDropState],
	);
	const handleDrop = React.useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			if (dropState !== "ok") return;
			setDropState("idle");

			const reader = new FileReader();
			reader.onloadend = () => {
				setFileURL(reader.result as string);
			};
			reader.readAsDataURL(e.dataTransfer.files![0]);
		},
		[dropState, imageRef.current],
	);

	const previewCanvasRef = React.useRef<HTMLCanvasElement>(null);
	const previewContextRef = React.useRef<CanvasRenderingContext2D>();
	const detectionCanvasRef = React.useRef<HTMLCanvasElement>(null);
	const detectionContextRef = React.useRef<CanvasRenderingContext2D>();

	const [qr, setQr] = React.useState<string>();
	React.useEffect(() => {
		if (qr) props.onDetect(qr);
	}, [qr]);

	React.useEffect(() => {
		if (!previewCanvasRef.current) return;
		previewContextRef.current =
			previewCanvasRef.current.getContext("2d") ?? undefined;
	}, [previewCanvasRef.current]);

	React.useEffect(() => {
		if (!detectionCanvasRef.current) return;
		detectionContextRef.current =
			detectionCanvasRef.current.getContext("2d") ?? undefined;
	}, [detectionCanvasRef.current]);

	const handleImageLoad = React.useCallback(() => {
		if (
			!imageRef.current ||
			!previewCanvasRef.current ||
			!previewContextRef.current ||
			!detectionCanvasRef.current ||
			!detectionContextRef.current
		) {
			return;
		}

		setFailed(false);

		const cP = previewCanvasRef.current;
		const ctxP = previewContextRef.current;
		const cD = detectionCanvasRef.current;
		const ctxD = detectionContextRef.current;

		// Draw preview
		cP.width = imageRef.current.width;
		cP.height = imageRef.current.height;
		ctxP.drawImage(imageRef.current, 0, 0, cP.width, cP.height);

		// Draw detection canvas
		cD.width = cP.width * 2;
		cD.height = cP.height * 2;
		ctxD.drawImage(imageRef.current, 0, 0, cD.width, cD.height);

		const scale = cP.width / cD.width;

		const imageData = ctxD.getImageData(0, 0, cD.width, cD.height);
		setTimeout(() => {
			const code = parseQR(
				imageData.data,
				imageData.width,
				imageData.height,
				{
					inversionAttempts: "dontInvert",
				},
			);
			if (code) {
				setQr(code.data);
				const corners = [
					code.location.topLeftCorner,
					code.location.topRightCorner,
					code.location.bottomRightCorner,
					code.location.bottomLeftCorner,
				].map((p) => ({
					x: p.x * scale,
					y: p.y * scale,
				}));
				for (let i = 0; i < corners.length; i++) {
					const b = corners[i];
					const a =
						corners[(i - 1 + corners.length) % corners.length];
					const c = corners[(i + 1) % corners.length];
					drawCorner(ctxP, a, b, c, 0.2, "green");
				}
			} else {
				setQr(undefined);
			}
		}, 0);
	}, [
		previewCanvasRef.current,
		previewContextRef.current,
		imageRef.current,
		setFailed,
	]);

	const handleImageError = React.useCallback(() => {
		setFailed(true);
	}, [setFailed]);

	return (
		<div
			className={clsx(
				classes.container,
				dropState === "ok"
					? classes.hoverOK
					: dropState === "nok"
					? classes.hoverNOK
					: undefined,
			)}
			onClick={handleLabelClick}
			onDragOverCapture={handleDragOver}
			onDragLeave={handleDragLeave}
			onDropCapture={handleDrop}
		>
			<Typography variant="body2" className={classes.label}>
				{failed ? (
					_("Failed to open image file")
				) : (
					<>
						{_("Click here to select image with QR code")}
						<br />
						{_("Or drag an image file here")}
					</>
				)}
			</Typography>
			{fileURL && (
				<img
					ref={imageRef}
					src={fileURL}
					onLoad={handleImageLoad}
					onError={handleImageError}
				/>
			)}
			<input
				type="file"
				accept="image/*"
				hidden
				ref={fileInputRef}
				onChange={handleFileChange}
			/>
			<canvas ref={previewCanvasRef}></canvas>
			<canvas hidden ref={detectionCanvasRef}></canvas>
		</div>
	);
};

export interface QRScannerProps {
	onDetect: (code: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = (props) => {
	const classes = useStyles();
	const { translate: _ } = useI18n();

	const [mode, setMode] = React.useState<"image" | "video">("image");

	const handleChange = (
		event: React.MouseEvent<HTMLElement>,
		newMode: "image" | "video" | null,
	) => {
		if (newMode) setMode(newMode);
	};

	return (
		<Paper className={classes.root}>
			<Typography variant="body1">
				{_("Select QR code source")}:
			</Typography>
			<ToggleButtonGroup value={mode} exclusive onChange={handleChange}>
				<ToggleButton value="video">
					<VideocamIcon />
				</ToggleButton>
				<ToggleButton value="image">
					<PhotoCameraIcon />
				</ToggleButton>
			</ToggleButtonGroup>
			<div style={{ gridColumn: "1 / span 2" }}>
				{mode === "video" ? (
					<QRScannerVideo {...props} />
				) : (
					<QRScannerImage {...props} />
				)}
			</div>
		</Paper>
	);
};
