# Troubleshooting

Z-Wave is a complex protocol and many things can go wrong in the communication. While there may be a problem with this adapter or the underlying library `zwave-js`, many issues are due to misbehaving or misconfigured devices and/or network connectivity problems. Please follow this guide before opening issues.

## The adapter does not start after updating to version 2.3 or higher

The error message looks like this:

```
Failed to initialize the driver: ZWaveError: The driver is not ready or has been destroyed
```

If this happens on Linux (e.g. Raspberry Pi), it can happen that the USB stick gets a new address on reboot, for example changes from `/dev/ttyUSB0` to `/dev/ttyUSB1`.

This can be avoided by using a fixed address for the USB stick. To do this, execute

```
ls -l /dev/serial/by-id
```

on the console and determine which of them corresponds to the Z-Wave stick, recognizable by the referenced path:

```
...
lrwxrwx 1 root root 13 Oct 25 20:19 usb-Silicon_Labs_CP2102N_USB_to_UART_Bridge_Controller_8ad925bd7b84e911a7a1d6217343c2-if00-port0 -> ../../ttyUSB0
```

In this case

```
/dev/serial/by-id/usb-Silicon_Labs_CP2102N_USB_to_UART_Bridge_Controller_8ad925bd7b84e911a7a7a1d6217343c2-if00-port0
```

should be entered in the adapter configuration instead of `/dev/ttyUSB0`.

> ATTENTION: When running ioBroker in a virtual machine, further steps are necessary. Please continue reading [here](vm-usb.md)!

If this does not help, the stick restart can be disabled using the _Disable restarting the controller on startup_ option, but this may limit functionality.

> This is definitely necessary with the zwave.me UZB1. However, the adapter tries to detect this stick by itself.

## Some states are missing

It is very likely that the interview is not yet completed. Check if the `ready` state is `true`. If not, have patience - the first interview of battery-powered nodes may take several hours. If the interview never gets completed, please consider opening an issue.

## The configuration is missing

Although the specification added the ability to discover the configuration, most devices out there don't use this yet. For those devices, configuration files are required which define the available parameters. To add support for a device, please do one of the following:

-   Open a Pull Request at the [`zwave-js` repo](https://github.com/AlCalzone/node-zwave-js) and provide such a configuration file. The [documentation](https://alcalzone.github.io/node-zwave-js/#/development/config-files) describes how this is done.
-   Or open an issue in the [`zwave-js` repo](https://github.com/AlCalzone/node-zwave-js) detailing which device you want added and provide a link to the device manual that includes a description of all parameters.

## A device does not respond

If communication with a device fails, the adapter automatically tries to resend the messages up to 3 times. Afterwards, it gives up and moves on to the next message. You should see an error in the ioBroker log tab which looks like one of the following:

**Failed to send the message after 3 attempts**  
If this happens, your network is either extremely busy at the moment or something is **really wrong** with the Z-Wave controller. Try waiting a bit, try removing and re-inserting the stick or try restarting your host.

**Timeout while waiting for an ACK from the controller**  
**Timeout while waiting for a response from the controller**  
**Timeout while waiting for a callback from the controller**  
If one of these messages show up, something is **really wrong** with the Z-Wave controller. Try removing and re-inserting the stick or try restarting your host.

**Failed to send the command after 3 attempts. Transmission queue full.**  
Too many messages were sent in a short time without waiting for a controller reply. The adapter takes care of this, so it should really not happen. If it does repeatedly, please open an issue.

**The controller response indicated failure**  
**The controller callback indicated failure**  
This usually means that the command could not be executed. Depending on what you tried to do, an issue might be worth it.

**Failed to send the command after 3 attempts (Status XYZ)**  
**One or more nodes did not respond to the multicast request (Status XYZ)**  
The command was accepted by the Z-Wave stick, but it could not be transmitted to the node. If the status is included, it tells you exactly what went wrong:

-   `NoAck`: The node did not acknowledge the message. It is probably asleep or dead. If the node is **not** battery-powered, it probably has a bad connection.
-   `Fail`: It was not possible to transmit data because the Z-Wave network is busy (jammed)

**Timed out while waiting for a response from the node**  
The node acknowledged the message but did not send the expected response in time. This usually means that the node does not support the command or it could not send the response.

## Providing the necessary information for an issue

If there is a problem with a node or in general, I need specific information to debug the issue. If you are reporting a problem, please include the following information:

1. A detailed logfile. The ioBroker log does **NOT** contain any helpful information.  
   You can enable the logfile in the adapter settings under **write a detailed logfile**. You'll find the logfile (`zwave-12345.log` or similar) under `/opt/iobroker/node_modules/iobroker.zwave2/build`.  
   When creating a logfile, please have some patience. Especially in large networks, it can take **minutes or hours** until the communication with a node is complete.

2. The adapter cache files (`<hex-number>.json`, `<hex-number>.values.jsonl`). You'll find them in `/opt/iobroker/iobroker-data/zwave2.0/cache`. The file with `metadata` in the name is usually not required.

3. The IDs (numbers) of the affected nodes. Without them, I have to guess what's going on.
