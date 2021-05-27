---
name: Device issue (english)
about: Use this if you have problems with a device
title: ""
labels: ""
assignees: ""
---

<!--
	🚨🚨🚨 STOP! STOP! STOP! 🚨🚨🚨

	Before opening an issue, please check the troubleshooting section if your problem is described there:
	https://github.com/AlCalzone/ioBroker.zwave2/blob/master/docs/en/troubleshooting.md

	Please fill in the template COMPLETELY. Incomplete issues cannot be worked on
-->

**Versions:**

-   Adapter version:
-   JS-Controller version: <!-- determine this with `iobroker -v` on the console -->
-   Node version: <!-- determine this with `node -v` on the console -->
-   Operating system:

**What is the problem?**  
E.g. which values are missing? Are there errors/warnings in the log?
If necessary, support the report with screenshots.

Do NOT mix problem reports from several devices. Prefer opening one issue per device.

**Which device is affected?**

<!--
	manufacturerId, productType and productId are determined as follows:
	1. Open Objects tab, click on the pencil icon next to Node (e.g. "zwave2.0.Node002").
	2. Switch to the tab "native" and copy the corresponding fields.

	Please copy "firmwareVersions" from the state "zwave2.0.NodeXYZ.Version.firmwareVersions" (replace XYZ with the corresponding node ID).
-->

-   Manufacturer / Model:
-   Node numbers:
-   `manufacturerId`:
-   `productType`:
-   `productId`:
-   `firmwareVersions`:

**Logfile of an interview:**

<!--
	To re-interview a device, open the adapter settings, switch to the "Devices" tab, click <kbd>...</kbd> after the device and <kbd>re-interview</kbd>.

	Watch the ioBroker logs - the interview is only finished when "interview completed" appears in the log. Battery-operated devices may need to be woken up manually several times.
-->

Upload as a file, do not paste as text. Do not shorten the logfile!  
Details on how to create one can be found at https://github.com/AlCalzone/ioBroker.zwave2/blob/master/docs/en/troubleshooting.md#providing-the-necessary-information-for-an-issue
