ENV_FILES ?= env.default env.project
BUILD_OPTIONS ?= --config --geoportal
PGSCHEMA ?= main

.PHONY: build
build:
    ./build --pgschema $(PGSCHEMA) $(BUILD_OPTIONS) $(ENV_FILES)
