# Bei Problemen

Z-Wave ist ein komplexes Protokoll, und viele Dinge können bei der Kommunikation schief gehen. Zwar sind Probleme mit diesem Adapter oder der zugrundeliegenden Bibliothek `zwave-js` nicht auszuschließen, in vielen Fällen ist ein Problem jedoch auf inkorrektes Verhalten der Geräte, eine falsche Gerätekonfiguration und/oder Netzwerkkonnektivitätsprobleme zurückzuführen. Vor dem Erstellen von Tickets bitte diesen Leitfaden befolgen.

## Der Adapter startet nach Update auf Version 2.3 oder höher nicht

Die Fehlermeldung sieht dabei etwa so aus:

```
Failed to initialize the driver: ZWaveError: The driver is not ready or has been destroyed
```

Wenn das auf Linux (z.B. Raspberry Pi) passiert, kann es daher kommen, dass der USB-Stick beim Neustart eine neue Adresse bekommt, z.B. diese sich von `/dev/ttyUSB0` auf `/dev/ttyUSB1` ändert.

Dies kann vermieden werden, indem eine feste Adresse für den USB-Stick genutzt wird. Dazu auf der Konsole, mittels

```
ls -l /dev/serial/by-id
```

mögliche Gerätenamen auflisten und ermitteln, welcher davon dem Z-Wave Stick entspricht, erkennbar am verlinkten Pfad:

```
...
lrwxrwxrwx 1 root root 13 Oct 25 20:19 usb-Silicon_Labs_CP2102N_USB_to_UART_Bridge_Controller_8ad925bd7b84e911a7a7a1d6217343c2-if00-port0 -> ../../ttyUSB0
```

In diesem Fall sollte in der Adapter-Konfiguration statt `/dev/ttyUSB0` der folgende Pfad eingetragen werden:

```
/dev/serial/by-id/usb-Silicon_Labs_CP2102N_USB_to_UART_Bridge_Controller_8ad925bd7b84e911a7a7a1d6217343c2-if00-port0
```

Wenn alles nicht hilft, kann der Stick-Neustart mittels der Option _Beim Adapterstart den Controller nicht neustarten_ deaktiviert werden, allerdings kann dies die Funktionalität einschränken.

## Einige Zustände fehlen

Es ist sehr wahrscheinlich, dass das Interview noch nicht abgeschlossen ist. Bitte zuerst prüfen, ob der Zustand `ready` auf `wahr` steht. Falls nicht, bitte Geduld mitbringen - das erste Interview von batteriebetriebenen Knoten kann mehrere Stunden dauern. Falls das Interview nie abgeschlossen wird, gerne ein Issue aufmachen.

## Die Geräte-Konfiguration fehlt

Obwohl in der Z-Wave-Spezifikation die Möglichkeit hinzugefügt wurde, die Konfiguration zu ermitteln, verwenden die meisten verfügbaren Geräte dies noch nicht. Für diese sind Konfigurationsdateien erforderlich, die die verfügbaren Parameter definieren. Um Unterstützung für ein Gerät hinzuzufügen, führen bitte eines der folgenden Dinge tun:

-   Einen Pull-Request im [`zwave-js` repo](https://github.com/AlCalzone/node-zwave-js) anlegen, welcher eine solche Konfigurationsdatei hinzufügt. Wie das geht, ist in der [documentation](https://alcalzone.github.io/node-zwave-js/#/development/config-files) beschrieben.
-   Alternativ ein Issue im [`zwave-js` repo](https://github.com/AlCalzone/node-zwave-js) erstellen und angeben, welches Gerät hinzugefügt werden soll. Bitte unbedingt einen Link zur Geräte-Anleitung angeben, in der die verfügbaren Parameter beschrieben sind.

## Ein Gerät reagiert nicht

Wenn die Kommunikation mit einem Gerät fehlschlägt, versucht der Adapter automatisch bis zu 3 Mal, die Nachrichten erneut zu senden. Danach gibt er auf und macht mit der nächsten Nachricht weiter. In diesem Fall sollte im ioBroker-Log einer der folgenden Fehler zu sehen sein:

**Failed to send the message after 3 attempts**  
Wenn das passiert, ist das Netzwerk entweder gerade überlastet oder mit dem Z-Wave-Controller stimmt etwas **wirklich** nicht. Bitte ein wenig warten, den Stick entfernen und wieder einstecken oder versuchen den Host neu zu starten.

**Timeout while waiting for an ACK from the controller**  
**Timeout while waiting for a response from the controller**  
**Timeout while waiting for a callback from the controller**  
Wenn eine dieser Meldungen auftaucht, stimmt mit dem Z-Wave-Controller etwas **wirklich** nicht. Bitte den Stick entfernen und wieder einstecken oder versuchen den Host neu zu starten.

**Failed to send the command after 3 attempts. Transmission queue full.**  
Zu viele Nachrichten wurden in kurzer Zeit verschickt, ohne auf eine Antwort des Controllers zu warten. Dies dürfte eigentlich nicht passieren, da sich der Adapter selbstständig darum kümmert. Wenn dennoch es wiederholt vorkommt, bitte ein Ticket erstellen.

**The controller response indicated failure**  
**The controller callback indicated failure**  
Dies bedeutet in der Regel, dass der Befehl nicht ausgeführt werden konnte. Ein Ticket könnte angebracht sein.

**Failed to send the command after 3 attempts (Status XYZ)**  
**One or more nodes did not respond to the multicast request (Status XYZ)**  
Der Befehl wurde vom Z-Wave-Stick akzeptiert, konnte aber nicht an das Gerät gesendet werden. Wenn die Fehlermeldung einen Status enthält, ist an diesem zu erkennen, was schief gelaufen ist:

-   `NoAck`: Das Gerät hat die Nachricht nicht bestätigt. Es schläft vermutlich (falls batteriebetrieben) oder ist tot bzw. hat eine schlechte Verbindung.
-   `Fail`: Es war nicht möglich, Daten zu übertragen, weil das Z-Wave-Netz ausgelastet bzw. gestört ist.

**Timed out while waiting for a response from the node**  
Das Gerät hat die Nachricht bestätigt, aber nicht rechtzeitig die erwartete Antwort gesendet. Dies bedeutet in der Regel, dass der Befehl nicht unterstützt ist oder die Antwort nicht gesendet werden konnte.

## Notwendige Informationen für ein Issue

Wenn es ein Problem mit einem Gerät oder ein generelles Problem gibt, brauche ich bestimmte Informationen, um das Problem zu beheben. Bei allen Meldungen bitte die folgenden Informationen mitliefern:

1. Eine detaillierte Logdatei. Das ioBroker-Log enthält **keine** hilfreichen Informationen.  
   Um die Logdatei zu aktivieren, in den Adapter-Einstellungen den Haken bei **Detaillierte Logdatei schreiben** setzen. Die Logdatei (`zwave-12345.log` oder ähnlich) befindet sich im Pfad `/opt/iobroker/node_modules/iobroker.zwave2/build`.  
   Beim Erstellen einer Logdatei bitte etwas Geduld haben. Besonders in großen Netzwerken kann es **Minuten oder Stunden** dauern, bis die Kommunikation mit einem Gerät abgeschlossen ist.

2. Die Adapter-Cache-Dateien (`<Hex-Zahl>.json`, `<Hex-Zahl>.values.jsonl`). Diese Dateien befinden sich unter `/opt/iobroker/iobroker-data/zwave2.0/cache`. Die Datei mit `metadata` im Namen wird normalerweise nicht benötigt.

3. Die IDs (Nummern) der betroffenen Geräte. Ohne diese kann ich nur raten (und dazu habe ich keine Lust).
