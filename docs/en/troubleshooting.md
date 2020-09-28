# Troubleshooting

Z-Wave is a complex protocol and many things can go wrong in the communication. If there is a problem with a node or in general, I need specific information to debug the issue. If you are reporting a problem, please include the following information:

1. A detailed logfile. The ioBroker log does **NOT** contain any helpful information.  
   You can enable the logfile in the adapter settings under **write a detailed logfile**. You'll find the logfile (`zwave-12345.log` or similar) under `/opt/iobroker/node_modules/iobroker.zwave2/build`.  
   When creating a logfile, please have some patience. Especially in large networks, it can take **minutes or hours** until the communication with a node is complete.

2. The adapter cache files (`<hex-number>.json`, `<hex-number>.values.jsonl`). You'll find them in `/opt/iobroker/iobroker-data/zwave2.0/cache`. The file with `metadata` in the name is usually not required.

3. The IDs (numbers) of the affected nodes. Without them, I have to guess what's going on.
