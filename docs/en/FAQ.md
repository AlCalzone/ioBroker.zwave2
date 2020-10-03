# FAQ

## Help, all my scripts trigger after an adapter restart!

This happens because the adapter tries to synchronize all its states with the data from the Z-Wave cache file. Since version 1.7.0, these state updates have the `q` (quality) parameter set to `0x40` instead of the default `0x00`.

To avoid triggering in this case, check the `q` parameter before reacting:

```js
on("zwave2.0.Node_002.Binary_Switch.currentValue", (obj) => {
	// Ignore updates from the cache
	if (obj.state.q !== 0) return;

	// react to the trigger as usual ...
});
```

## How to send custom commands from scripts?

See [Sending custom commands](sendCommand.md)
