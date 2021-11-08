# Using USB sticks in virtual machines

In virtual machines, e.g. Proxmox or on Synology, further configuration is necessary to run Z-Wave USB sticks. For this purpose `udev` rules have to be created. For this purpose there is a [helper script](https://raw.githubusercontent.com/AlCalzone/ioBroker.zwave2/master/docs/udev.sh) which can be executed as follows:

```bash
curl -sL https://raw.githubusercontent.com/AlCalzone/ioBroker.zwave2/master/docs/udev.sh | bash -s -- /pfad/to/usbstick /pfad/in/the/vm
```

`/path/to/usbstick` is the absolute path to the USB stick (`/dev/serial/by-id/...`).
`/path/in/vm` is the path where the USB stick should be accessed in the virtual machine, e.g. `/dev/zwave`. This one is entered in the adapter.

The script prints a line with the new `udev` rule at the end, which looks something like this:

```
SUBSYSTEM=="tty", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", SYMLINK+="/dev/zwave", MODE="0666"
```

How to proceed depends on the VM used.

## Synology (VM, not Docker)

> → see also https://community.openhab.org/t/synology-usb-configuration-udev-rules/2175/4

Here it may be necessary to add the user group that should have access later to the rule. For example, to give access to the group `users`, add `, GROUP="users"` to the rule:

```
SUBSYSTEM=="tty", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", SYMLINK+="/dev/zwave", MODE="0666", GROUP="users"
```

Then create the file:

```
nano /lib/udev/rules.d/50-usb-zwave.rules
```

and insert the above rule. Save with <kbd>CTRL</kbd>+<kbd>X</kbd> followed by <kbd>Y</kbd>.

## Proxmox/LXC

> → see also https://drozmotix.github.io/languages/en/BasicSetup/03.ProxmoxLXC.html#_3-mount-usb-devices

### Create the rule

First you have to give the group `users` access to the USB stick, for this add `, GROUP="users"` to the rule:

```
SUBSYSTEM=="tty", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", SYMLINK+="/dev/zwave", MODE="0666", GROUP="users"
```

Then create the file:

```
nano /etc/udev/rules.d/50-usb-zwave.rules
```

and insert the above rule. Save with <kbd>CTRL</kbd>+<kbd>X</kbd> followed by <kbd>Y</kbd>.

Reload the configuration and check if the new path (here `/dev/zwave`) shows up:

```
udevadm control --reload
ls -l /dev/
```

> a reboot of Proxmox may be necessary.

### Gerät in LXC einbinden

Now determine the ACL ID.

```
ls -l /dev/zwave
```

gives an output similar to

```
lrwxrwxrwx 1 root root 7 Oct 12 23:55 /dev/zwave -> ...
```

The ACL ID can be found between the user group `root` and the date, so here `7`.

Open the LXC configuration

```
nano /etc/pve/lxc/XXX.conf
```

and insert the following lines, replacing `7` with the number from the previous step if necessary and `/dev/zwave` with the actual path.

```
lxc.cgroup.devices.allow: c 7:* rwm
lxc.mount.entry: /dev/zwave dev/zwave none bind,optional,create=file
```
