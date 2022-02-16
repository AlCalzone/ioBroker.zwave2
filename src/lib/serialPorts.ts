import type { AdapterInstance } from "@iobroker/adapter-core";
import { distinct } from "alcalzone-shared/arrays";
import fs from "fs-extra";
import path from "path";
import { Driver } from "zwave-js";

function isSerialPort(path: string): boolean {
	// get only serial port names
	if (!/(tty(S|ACM|USB|AMA|MFD)|rfcomm)/.test(path)) return false;

	return fs.statSync(path).isCharacterDevice();
}

export async function enumerateSerialPorts(
	adapter: AdapterInstance<any, any>,
): Promise<string[]> {
	const result: string[] = [];

	// On Linux, search the /dev dir for serial ports
	const devDirName = "/dev";
	try {
		result.push(
			...(await fs.readdir(devDirName))
				.map((file) => path.join(devDirName, file))
				.filter(isSerialPort),
		);
	} catch {}

	// Also try to use the serial port library to find serial ports
	try {
		result.push(...(await Driver.enumerateSerialPorts()));
	} catch (e: any) {
		if (e.code === "ENOENT" && /udevadm/.test(e.message)) {
			adapter.log.warn(
				`Cannot list serial ports because "udevadm" was not found on PATH!`,
			);
			adapter.log.warn(
				`If it is installed, add it to the PATH env variable.`,
			);
			adapter.log.warn(`Otherwise, install it using "apt install udev"`);
		}
	}
	return distinct(result).sort();
}
