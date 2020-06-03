import type { Device } from "./backend";

export function statusToIconName(status: Device["status"]): string {
	switch (status) {
		case "alive":
		case "awake":
			return "wifi";
		case "asleep":
			return "power_settings_new";
		case "dead":
			return "wifi_off";
		default:
			return "device_unknown";
	}
}

export function statusToCssClass(status: Device["status"]): string {
	switch (status) {
		case "alive":
		case "awake":
			return "green-text text-darken-3";
		case "asleep":
			return "light-blue-text text-accent-4";
		case "dead":
			return "red-text text-darken-4";
		default:
			return "";
	}
}
