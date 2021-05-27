---
name: Geräte-Problem (deutsch)
about: Bei Problemen mit einem Gerät
title: ""
labels: ""
assignees: ""
---

<!--
	🚨🚨🚨 STOP! STOP! STOP! 🚨🚨🚨
	Vor dem Erstellen eines Issues bitte prüfen, ob das Problem hier beschrieben ist:
	https://github.com/AlCalzone/ioBroker.zwave2/blob/master/docs/de/bei-problemen.md

	Vorlage bitte VOLLSTÄNDIG ausfüllen. Unvollständige Issues können nicht bearbeitet werden
-->

**Versionen:**

-   Adapterversion: <adapter-version>
-   JS-Controller-Version: <js-controller-version> <!-- Kann mit `iobroker -v` auf der Konsole ermittelt werden -->
-   Node.js Version: <node-version> <!-- Kann mit `node -v` auf der Konsole ermittelt werden -->
-   Betriebssystem: <os-name>

**Was ist das Problem?**  
z.B. welche Werte fehlen? Gibt es Fehler/Warnungen im Log?
Ggf. durch Screenshots unterstützen.

Problemberichte mehrere Geräte NICHT mischen. Lieber ein Issue pro Gerät.

**Welches Gerät ist betroffen?**

<!--
	manufacturerId, productType und productId werden wie folgt ermittelt:
	1. Objekte-Tab, neben Node (z.B. "zwave2.0.Node002") auf den Bleistift klicken
	2. Auf Reiter "Nativ" wechseln und die entsprechendenden Felder auslesen

	firmwareVersions bitte aus dem Datenpunkt "zwave2.0.NodeXYZ.Version.firmwareVersions" kopieren (XYZ bitte durch die entsprechende Node-ID ersetzen).
-->

-   Hersteller / Modell:
-   Node-Nummern:
-   `manufacturerId`:
-   `productType`:
-   `productId`:
-   `firmwareVersions`:

**Logfile eines Interviews:**

<!--
	Um ein Gerät erneut zu interviewen, Adaptereinstellungen öffnen, auf Tab "Geräte" wechseln, hinter dem Gerät auf <kbd>...</kbd> klicken, und <kbd>Erneut interviewen</kbd>.

	ioBroker-Log beobachten - das Interview ist erst fertig, wenn "interview completed" im Log steht. Batteriebetriebene Geräte müssen ggf. mehrfach von Hand aufgeweckt werden.
-->

Als Datei hochladen, nicht als Text einfügen. Nicht kürzen!  
Details zum Erstellen finden sich unter https://github.com/AlCalzone/ioBroker.zwave2/blob/master/docs/de/bei-problemen.md#notwendige-informationen-f%C3%BCr-ein-issue
