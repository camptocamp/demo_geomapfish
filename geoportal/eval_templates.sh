#!/bin/bash
set -e

find /app/ -name *.tmpl -print | while read file; do
    envsubst < ${file} > ${file%.tmpl}
done

exec "$@"
