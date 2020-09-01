# Older changes
## 1.4.0 (2020-06-26)
Updated `zwave-js` to v4.0.1. This includes the following features:
* Improved support for legacy devices that don't include all CCs in the NIF, like `Fibaro FGRM 222`.
* Added support for `Sound Switch CC`
* Added support for `Alarm Sensor CC`. This CC will only be used if `Notification CC` is not supported.

## 1.3.8 (2020-06-18)
* Fixed transmission issues caused by overlapped secure transactions

## 1.3.6 (2020-06-17)
* Added some details to the `Multi Channel Association CC` interview logging
* Configured lifeline node associations of newer devices should now be set correctly
* `CRC-16`-encapsulated commands can now be received
* The log file is complete again

## 1.3.4 (2020-06-16)
* The association UI no longer crashes if an empty association object is returned
* The target endpoint selection for associations is now hidden if an association does not support multiple target endpoints
* Fixed an incompatibility with nodes that have a different number of "normal" associations than multi channel associations, e.g. _FGRM-222_
* The association UI now distinguishes between associations to the device and the root endpoint
* Many fixes related to handling associations and multi channel associations
* Creating a log file works again
* Added support for Devolo Dimmer (MT2760) and Shutter (MT2761) (thanks @nicoh88)
* When the interview process fails to set a lifeline association with `Multi Channel Association CC`, it now tries again with `Association CC`

## 1.3.3 (2020-06-15)
* Logfiles are now logged in the correct order and some unnecessary logging was removed
* Fixed an error when using the DoorLockCC setValue API when not all configuration values have been received
* Errors while sending firmware fragments are now caught and logged
* The adapter no longer crashes when the serial device exists but does not respond
* Improved compatibility with some devices that send invalid `Multi Channel Endpoint Find Reports`, e.g. _TKB Home TZ74 Dual Switch_

## 1.3.2 (2020-06-15)
* Fixed a crash that happens when a `Multi Command CC` is received

## 1.3.1 (2020-06-14)
* Fixed an issue where secure Multi Channel Association Reports were not correctly deserialized
* Fixed an issue where some associations to the root endpoint could not be removed

## 1.3.0 (2020-06-14)
* Added support for firmware updates. WARNING: Use at your own risk!
* `Fibaro FGMS-001 Motion sensor`: All association groups are now configured to point to the controller
* When re-interviewing a node, the information about its command classes is also reset

## 1.2.1 (2020-06-13)
* The inclusion dropdown works again

## 1.2.0 (2020-06-12)
* Added a possibility to restart the interview for single nodes
* The cached lifeline associations (for `Multi Channel Association` and `Association` CCs) are now updated if they are changed during the interview

## 1.1.0 (2020-06-11)
* Added support for `Door Lock CC V4`
* Added support for `Lock CC`
* Fixed the `E5` issue with Danfoss thermostats (hopefully)
* Fixed an issue where sleeping nodes could block the entire send queue
* Fixed an issue where some CCs did not store the received values
* Fixed an issue where the values of endpoint 1 of some multichannel devices were not updated
* The node interview is no longer aborted if a response for the following requests times out:
  * Battery status
  * Battery health
  * Binary Sensor status
  * Multilevel Sensor status

## 1.0.0 (2020-06-04)
* Changed the compatibility config queries for Danfoss thermostats, so queued setpoint changes are not overwritten

## 0.14.9 (2020-06-03)
* Placeholder object names (e.g. `Node 003`) for non-reachable nodes are now overwritten with the correct name when the nodes are interviewed.

## 0.14.8 (2020-06-03)
* Fixed an issue where secure sleeping nodes could block all communication with other nodes

## 0.14.7 (2020-06-03)
* Fixed an issue where interviews could get stuck for sleeping nodes
* Fixed a crash that happened when decoding a secure message with an unsupported payload

## 0.14.6 (2020-06-02)
* Added support for `Protection CC`
* Fixed several bugs in `Security CC`
* Updates from a node that span multiple messages are now correctly decoded
* During the startup, device objects are created for asleep and dead nodes. This allows removing failed devices from the network even after the cache was cleared.

## 0.14.5 (2020-06-01)
* Non-securely included nodes which support Security CC should no longer stall the interview process
* Added an indicator in the devices list to show which nodes are communicating securely

## 0.14.4 (2020-05-30)
* The correct status of devices is now shown in the device table instead of unknown
* The inclusion status is no longer incorrectly shown as active when the adapter was just started
* Improved handling and retransmission of messages that require nested communication (like Security CC).

## 0.14.3 (2020-05-27)
* Added a button to generate a new network key
* Added a tooltip to explain the network key format
* It is now possible to copy-and-paste a network key (e.g. from the original adapter). The pasted key is automatically cleaned from unnecessary characters.
* Fixed a crash that happened when removing nodes with associations to a node that only supports `Multi Channel Association CC` V1
* When a node is removed, its interview process is now canceled
* When a node is manually woken up, the interview is now immediately continued if the adapter was waiting for a response from the node
* All non-critical errors are now correctly logged instead of `undefined`

## 0.14.2 (2020-05-27)
Various fixes related to `Security CC` when the network key is not configured. This means that the adapter will not crash, but in many cases no meaningful communication with secure nodes will happen and interviews will not be completed.

## 0.14.1 (2020-05-25)
* Fixed various crashes:
  * Security CC can only be used when...
  * issuedCommands.has is not a function
* _known issue:_ Retransmitting secure messages may cause a crash

## 0.14.0 (2020-05-24)
* Added support for secure communication (`S0`) and choosing between secure and non-secure inclusion of nodes
* Fix: It is now possible to stop inclusion and exclusion processes again

## 0.13.5 (2020-05-24)
Fixed the frontend that was broken in v0.13.3

## 0.13.4 (2020-05-22)
User-defined node names are now really preserved

## 0.13.3 (2020-05-21)
* Initial values for `ready` and `status` states are now read from the nodes
* Ensure that the adapter notices when a node is ready

## 0.13.2 (2020-05-21)
* Various stability and speed improvements during the interview
* Config parameter \#5 has been removed from the `Aeotec WallMote Quad` for firmware versions `<= 1.5`

## 0.13.1 (2020-05-18)
* Empty node names are now overwritten with the default name
* Fixed an issue where Multi Channel Associations for older devices were missing

## 0.13.0 (2020-05-17)
Added a user interface to manage associations between nodes

## 0.12.2 (2020-05-17)
* Previously missing updates from multi channel devices should now be received again
* Fixed an issue where the interview process was stalled by requesting information the devices don't understand
* Fixed a crash that could happen when the adapter is restarted

## 0.12.1 (2020-05-12)
* The cache file is now loaded again correctly. This fixes some missing reports from newer multi channel devices.
* Nodes are now sent to sleep 1 second after waking up if there are no pending messages. This fixes issues with some devices that expect this behavior.

## 0.12.0 (2020-05-08)
* **BREAKING**: Raised minimum Node.js version to 10
* **BREAKING**: Some duplicate states for the root endpoint have been removed
* The network heal now updates the routes from all nodes to the controller and between associated nodes
* Significantly reduced CPU consumption and filesystem accesses during the adapter startup
* Added support for the `Color Switch CC`
* Fixed a crash that happened when trying to set an invalid configuration value
* Updated dependencies

## 0.11.7 (2020-04-25)
* Fixed a crash that happened when setting invalid values in ioBroker
* Fixed some compilation issues with newer typings

## 0.11.6 (2020-03-22)
Changing values of the `Fibaro CC` now sends commands to the device

## 0.11.5 (2020-03-16)
Fixed a bug that caused the interview process to be stuck on the `Fibaro CC`

## 0.11.4 (2020-03-15)
Fixed a crash that happened when saving the network state including a `Manufacturer Proprietary CC` to cache

## 0.11.3 (2020-03-11)
Fixed a crash that happens when controlling blinds using the `Fibaro Venetian Blind CC`

## 0.11.2 (2020-03-09)
Updated `zwave-js` to v2.15.3. This includes the following fixes:
* Fixed an issue where the firmware version of nodes would not be read correctly
* Fixed an issue that caused the interview procedure for the `Manufacturer Proprietary CC` to be skipped

## 0.11.1 (2020-03-07)
Updated `zwave-js` to v2.15.2. This includes the following improvements and fixes:
* Shortened the interview procedure for some multichannel devices
* Updated `ZHC5002` configuration for firmware versions >= 2.02
* The clock of devices supporting `Clock CC` can now be automatically kept in sync with the controller
* Completed support for the `Fibaro Venetian Blind CC`
* Added support for older devices supporting `Multi Instance CC`
* The name and status of the controller is now correctly shown in the objects list
* Values for the root endpoint are now hidden if a corresponding values exists on at least one endpoint

## 0.10.0 (2020-02-13)
* Updated `zwave-js` to v2.13.3 to improve support for older `Multi Channel` devices
* Added an _actions_ dialog to the device overview, which allows performing node-specific actions. The first available action is removing failed nodes.
* Added a `ready` state for nodes which can be used in scripts to check if the node is ready to accept commands
* Value that are set to `undefined` are now converted to `null` before being passed to ioBroker. This avoids a bug in the javascript adapter where triggers would be called with wrong state values.

## 0.9.6 (2020-02-10)
Updated `zwave-js` to v2.13.2. This includes the following fixes:
* Improved support for older devices with multiple endpoints
* The _HeatIt Z-Push Button 8_ should now correctly be detected
* Potential fix for weird behavior of Start Level Change commands in some devices.

## 0.9.5 (2020-02-07)
Updated `zwave-js` to v2.13.0. This includes the following changes:
* Improved support for some notifications types
* Added support for the `Clock CC`.
* Fixed a bug where unsolicited commands could wrongly be interpreted as a response to the current request

## 0.9.4 (2020-02-02)
* Small performance improvements
* Fixed an error that could happen when a state was changed before the driver is ready
* Updated `zwave-js` to v2.12.3. This includes the following changes:
  * The interview sequence for `Thermostat CC` V1/V2 should no longer get stuck
  * Improved handling of nodes that don't respond to a request
  * Minor stability improvements and bugfixes

## 0.9.3 (2020-01-26)
* Updated `zwave-js` to v2.12.2. This should fix issues with older Thermostats.

## 0.9.2 (2020-01-25)
Updated `zwave-js` to v2.12.1. This includes the following changes:
* When a node is removed from the network, all associations to it are also removed
* The interview procedure is now canceled and retried when an error occurs instead of silently failing all futher steps
* Improvents to the network heal process were made
* Several stability improvements regarding the interview procedure and handling of sleeping nodes

## 0.9.1 (2020-01-21)
* The progress report for network healing now correctly distinguishes between not yet healed nodes and nodes that failed to heal
* A potential source of stalled communication because of a missing timeout was eliminated

## 0.9.0 (2020-01-21)
Updated `zwave-js` to v2.11.0. This includes the following changes:
* Improved `Multilevel Switch` support for some devices that report the immediate state after a `targetValue` change but not the final values
* Fixed two issues where the communication with nodes (especially during the interview) could get stuck

## 0.8.2 (2020-01-18)
Updated `zwave-js` to v2.10.0. This includes the following changes:
* Locally reset devices are now treated like failing nodes and automatically removed from the controller
* The Notification status is now also queried on wakeup
* The status of non-reporting listening nodes is now regularly queried
* The controller is now correctly treated as an awake node when prioritizing messages

## 0.8.1 (2020-01-07)
* Brand new icon!
* Updated `zwave-js` to v2.9.1. This includes the following fixes:
  * Notification CC Reports that are received as a response during the interview are now correctly handled
  * Status changes for nodes are now handled better
  * The scenes of the Scene Activation CC are now automatically reset after the duration has elapsed.

## 0.8.0 (2020-01-04)
* The cache file is now saved in `iobroker-data`, so it doesn't get lost between updates
* Added a button on the device overview tab to clear the cache

## 0.7.2 (2020-01-04)
* Fixed an issue where indicators with `boolean` values could not be written to

## 0.7.1 (2020-01-03)
Updated `zwave-js` to v2.7.0. This includes the following changes:
* The driver is no longer reset when unexpected data is received. Instead the invalid bytes are skipped.
* `Basic CC` reports no longer create a value when they are mapped to another CC
* `IndicatorCC`: Binary indicators now use `boolean` values
* `IndicatorCC`: V1 indicators (unspecified) are now ignored if an endpoint is known to have V2 indicators

## 0.7.0 (2020-01-02)
* Added a config option to write debug logfiles
* Updated `zwave-js` to v2.6.0 to add support for `Scene Activation CC`

## 0.6.4 (2020-01-01)
* Bugfixes

## 0.6.3 (2019-12-30)
* Updated `zwave-js` to v2.5.1. This includes the following changes:
  * Fixed issues with the `Meter CC` and `Indicator CC`
  * Fixed an issue where the information about device endpoints was not correctly saved and restored
  * Several configuration parameters with duplicate labels were renamed
* Node objects and states are now synchronized when the node is ready (rather than waiting for the interview to be completed)
* When `udevadm` is not installed on a unix system, the adapter no longer crashes when opening the configuration UI
* If a node name was manually changed, that change is now preserved
* The debug log is no longer filled with "state changed" logs
* Updated some dependencies

## 0.6.2 (2019-12-22)
* When nodes are removed, the channel objects are now also removed
* `BasicCC` commands from some devices are now mapped to more specific CCs
* Fixed the interview procedure for `IndicatorCC`
* Fixed some causes for crashs

## 0.6.1 (2019-12-18)
* Enabled scrolling in the device list

## 0.6.0 (2019-12-17)
* Improved handling of sleeping nodes
* New interactive network healing process in the configuration UI

## 0.5.2 (2019-12-14)
* Fixed installation issues with `alcalzone-shared`

## 0.5.1 (2019-12-13)
* A new settings page has been added with a device overview and buttons to add and remove nodes from the network
* Minor bugfixes

## 0.4.0 (2019-12-11)
* The network map is now drawn correctly when there are only unconnected nodes
* Nodes and command classes are now represented with device and channel objects
* Updated `zwave-js` to v2.2.0. This includes the following changes:
  * Less errors are logged when opening the serial port fails
  * Accessing a node's or endpoint's `commandClasses` property with `Symbol`s no longer causes a crash. _(This should not be an issue in ioBroker)_
  * Revised querying logic for devices without Z-Wave+ or Lifeline associations
  * Added support for `Indicator CC`

## 0.3.4 (2019-12-07)
* Non-critical errors from `zwave-js` are now logged instead of crashing the adapter
* Fixed a crash that happens when the object for a state is missing
* When the Z-Wave driver fails to start, an error is now logged instead of crashing the adapter
* The adapter settings are no longer polluted with the `serialports` list from the frontend

## 0.3.3 (2019-12-01)
* Updated `zwave-js` to v2.1.0. This includes the following changes:
  * Support for the `Meter CC`
  * Support for unsigned configuration parameters

## 0.3.2 (2019-11-28)
* Fixed a crash when property(Key) names contain weird punctuation

## 0.3.1
* Fixed a crash from v0.3.0

## 0.3.0
* Updated `zwave-js` to v2.0.0. For the full list of changes, see [here](https://github.com/AlCalzone/node-zwave-js/blob/master/CHANGELOG.md#200-2019-11-26). Notable improvements include:
  * Added configuration files for over 1000 devices. This improves support for some older devices and greatly improves the `Configuration CC`.
  * `Basic` CC is now hidden if a node support other Actuator CCs
  * Fixed `Binary Sensor` support
* Improved generation of state names for complex property names

## 0.2.1
* The network map now correctly displays the nodes' IDs

## 0.2.0
* Update `zwave-js` from v1.5.0 to v1.7.0. For the full list of changes, see [here](https://github.com/AlCalzone/node-zwave-js/blob/master/CHANGELOG.md#170-2019-11-03). Notable improvements include:
  * Complete `Multi Channel` support
  * Improved `Multilevel Switch` support
* improve value/metadata logging and change loglevel to debug
* use unit from value metadata
* use translated property keys to name states

## 0.1.3
* Update `zwave-js` dependency. Notable improvements include:
  * Support for `Time` and `Time Parameters` CCs. This automatically sets the correct time on supporting nodes.
  * Support for `Battery` CC v2
  * Cleanup of CC values
* Update misc. dependencies

## 0.1.2
* Several bugfixes and working admin menu

## 0.0.1
* initial release
