# Benutzung von USB-Sticks in virtuellen Maschinen

In virtuellen Maschinen, z.B. Proxmox oder auf Synology ist weitere Konfiguration nötig, um Z-Wave USB-Sticks zu betreiben. Hierfür müssen `udev`-Regeln erstellt werden. Dazu gibt es ein [Helfer-Skript](https://raw.githubusercontent.com/AlCalzone/ioBroker.zwave2/master/docs/udev.sh), welches wie folgt ausgeführt werden kann:

```bash
curl -sL https://raw.githubusercontent.com/AlCalzone/ioBroker.zwave2/master/docs/udev.sh | bash -s -- /pfad/zum/usbstick /pfad/in/der/vm
```

`/pfad/zum/usbstick` ist hierbei der absolute Pfad zum USB-Stick (`/dev/serial/by-id/...`).
`/pfad/in/der/vm` ist der Pfad, unter dem der USB-Stick in der virtuellen Maschine angesprochen werden soll, z.B. `/dev/zwave`. Dieser wird auch im Adapter eingetragen.

Das Skript gibt am Ende eine Zeile mit der neuen `udev`-Regel aus, die in etwa so aussieht:

```
SUBSYSTEM="tty", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", SYMLINK+="/dev/zwave", MODE="0666"
```

Wie es weitergeht, hängt von der genutzten VM ab.

## Synology (VM, nicht Docker)

> → siehe auch https://community.openhab.org/t/synology-usb-configuration-udev-rules/2175/4

Hier kann es nötig sein, die Regel um die Benutzergruppe zu ergänzen, die später Zugriff haben soll. Um bspw. der Gruppe `users` Zugriff zu geben, die Regel um `, GROUP="users"` ergänzen:

```
SUBSYSTEM="tty", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", SYMLINK+="/dev/zwave", MODE="0666", GROUP="users"
```

Anschließend die Datei anlegen:

```
nano /lib/udev/rules.d/50-usb-zwave.rules
```

und die obige Regel einfügen. Mit <kbd>STRG</kbd>+<kbd>X</kbd>, gefolgt von <kbd>Y</kbd> speichern.

## Proxmox/LXC

> → siehe auch https://drozmotix.github.io/languages/en/BasicSetup/03.ProxmoxLXC.html#_3-mount-usb-devices

### Regel erstellen

Zunächst muss der Gruppe `users` Zugriff auf den USB-Stick gegeben werden, dazu die Regel um `, GROUP="users"` ergänzen:

```
SUBSYSTEM="tty", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", SYMLINK+="/dev/zwave", MODE="0666", GROUP="users"
```

Anschließend die Datei anlegen:

```
nano /etc/udev/rules.d/50-usb-zwave.rules
```

und die obige Regel einfügen. Mit <kbd>STRG</kbd>+<kbd>X</kbd>, gefolgt von <kbd>Y</kbd> speichern.

Die Konfiguration neu laden und prüfen, ob der neue Pfad (hier `/dev/zwave`) auftaucht:

```
udevadm control --reload
ls -l /dev/
```

> ggf. ist ein Reboot von Proxmox nötig.

### Gerät in LXC einbinden

Nun die ACL-ID ermitteln.

```
ls -l /dev/zwave
```

ergibt eine Ausgabe ähnlich

```
lrwxrwxrwx 1 root root 7 Oct 12 23:55 /dev/zwave -> ...
```

Die ACL-ID findet sich zwischen der Nutzergruppe `root` und dem Datum, also hier `7`.

Die LXC-Konfiguration öffnen

```
nano /etc/pve/lxc/XXX.conf
```

und die folgenden Zeilen einfügen, dabei falls nötig die 7 mit der Zahl aus dem vorherigen Schritt und `/dev/zwave` mit dem tatsächlichen Pfad ersetzen.

```
lxc.cgroup.devices.allow: c 7:* rwm
lxc.mount.entry: /dev/zwave dev/zwave none bind,optional,create=file
```
