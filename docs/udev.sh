#!/bin/bash

#
# Helper script to create udev rules for virtual environments
#

if [ $# -ne 2 ]; then
    echo "ERROR: Incorrect number of arguments. Expected 2, got $#"
    echo ""
    echo "USAGE: $0 USB_PATH CONTAINER_PATH"
    echo ""
    echo "  USB_PATH is the physical device path of the USB stick and should be specified"
    echo "           using /dev/serial/by-id/... paths"
    echo "  CONTAINER_PATH is the path inside the virtual machine without leading /dev/."
    echo "           For example entering zwave will create a symlink at /dev/zwave"
    echo ""
    exit 1
fi

USB_PATH=$1
CONTAINER_PATH=$2

if ! [ -c "$USB_PATH" ]
then
    echo "ERROR: $USB_PATH is not a serial device"
    exit 1
fi

if [[ "$CONTAINER_PATH" == /dev/* ]]
then
    echo "ERROR: $CONTAINER_PATH must be given without leading /dev/"
    exit 1
fi


if ! command -v udevadm &> /dev/null
then
    echo "ERROR: udevadm could not be found"
    exit 1
fi

ID_VENDOR=$(udevadm info -a -p $(udevadm info -q path -n "$USB_PATH") | grep -m 1 "ATTRS{idVendor}" | sed 's/^ *//g')
ID_PRODUCT=$(udevadm info -a -p $(udevadm info -q path -n "$USB_PATH") | grep -m 1 "ATTRS{idProduct}" | sed 's/^ *//g')

if [ -z "$ID_VENDOR" ] || [ -z "$ID_PRODUCT" ]
then
    echo "ERROR: did not find device IDs. Are you sure $USB_PATH points to a USB stick?"
    exit 1
fi

CMD="SUBSYSTEM==\"tty\", $ID_VENDOR, $ID_PRODUCT, SYMLINK+=\"$CONTAINER_PATH\", MODE=\"0666\""

echo "This is your udev rule, copy it:"
echo ""
echo "$CMD"
