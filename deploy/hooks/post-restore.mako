#!/bin/sh -ex

cd ${deploy["code_destination"]}
make -f $TARGET.mk template-clean
rm apache/tiles.conf
make -f $TARGET.mk build -j2

rm /tmp/np
