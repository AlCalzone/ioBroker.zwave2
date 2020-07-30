# Sending custom commands

As of version 1.5.0, it is possible to send custom Z-Wave commands from a script and receive the response. To do so, use `sendTo` with the command `"sendCommand"`.

Here's an example for turning off a switch:

<!-- prettier-ignore -->
```js
sendTo(
	"zwave2.0",
	"sendCommand",
	{
		nodeId: 17, 					// The target node
		endpoint: 1, 					// The target endpoint (optional)
		commandClass: "Binary Switch", 	// Which command class to use
		command: "set", 				// Which command should be sent
		args: [false], 					// Arguments for the command
	},
	({ error, result }) => {
		if (error) {
			log(error, "error");
		} else {
			// Do something with the result (if there is any)
			// In this case, "undefined" is logged
			log(JSON.stringify(result));
		}
	},
);
```

and one for reading the current switch status:

<!-- prettier-ignore -->
```js
sendTo(
	"zwave2.0",
	"sendCommand",
	{
		nodeId: 17, 					// The target node
		endpoint: 1, 					// The target endpoint (optional)
		commandClass: "Binary Switch", 	// Which command class to use
		command: "get", 				// Which command should be sent
	},
	({ error, result }) => {
		if (error) {
			log(error, "error");
		} else {
			// Prints {"currentValue": false}
			log(JSON.stringify(result));
		}
	},
);
```
