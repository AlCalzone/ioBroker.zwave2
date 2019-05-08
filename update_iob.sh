#!/bin/bash

set -ex

IOB_DIR=/C/iobroker

if [ "$1" = "--force" ]; then
	cd $IOB_DIR
	./iobroker.bat url /C/Repositories/ioBroker.zwave2/iobroker.zwave2-0.0.1.tgz
	cd node_modules/iobroker.zwave2
	npm link zwave-js
else
	cp -rf ./build $IOB_DIR/node_modules/iobroker.zwave2
	cp -f ./io-package.json $IOB_DIR/node_modules/iobroker.zwave2
fi
cd $IOB_DIR
./iobroker.bat restart zwave2
