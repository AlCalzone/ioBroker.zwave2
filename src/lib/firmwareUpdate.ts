import type { FirmwareFileFormat } from "zwave-js/Utils";

export function guessFirmwareFormat(
	filename: string,
	firmware: Buffer,
): FirmwareFileFormat {
	if (
		(filename.endsWith(".exe") || filename.endsWith(".ex_")) &&
		firmware.includes(Buffer.from("Aeon Labs", "utf8"))
	) {
		return "aeotec";
	} else if (/\.(hex|ota|otz)$/.test(filename)) {
		return filename.slice(-3) as FirmwareFileFormat;
	} else {
		throw new Error("could not detect firmware format");
	}
}
