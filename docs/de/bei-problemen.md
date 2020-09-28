# Bei Problemen

Z-Wave ist ein komplexes Protokoll, und viele Dinge können bei der Kommunikation schief gehen. Wenn es ein Problem mit einem Gerät oder ein generelles Problem gibt, brauche ich bestimmte Informationen, um das Problem zu beheben. Bei allen Meldungen bitte die folgenden Informationen mitliefern:

1. Eine detaillierte Logdatei. Das ioBroker-Log enthält **keine** hilfreichen Informationen.  
   Um die Logdatei zu aktivieren, in den Adapter-Einstellungen den Haken bei **Detaillierte Logdatei schreiben** setzen. Die Logdatei (`zwave-12345.log` oder ähnlich) befindet sich im Pfad `/opt/iobroker/node_modules/iobroker.zwave2/build`.  
   Beim Erstellen einer Logdatei bitte etwas Geduld haben. Besonders in großen Netzwerken kann es **Minuten oder Stunden** dauern, bis die Kommunikation mit einem Gerät abgeschlossen ist.

2. Die Adapter-Cache-Dateien (`<Hex-Zahl>.json`, `<Hex-Zahl>.values.jsonl`). Diese Dateien befinden sich unter `/opt/iobroker/iobroker-data/zwave2.0/cache`. Die Datei mit `metadata` im Namen wird normalerweise nicht benötigt.

3. Die IDs (Nummern) der betroffenen Geräte. Ohne diese kann ich nur raten (und dazu habe ich keine Lust).
