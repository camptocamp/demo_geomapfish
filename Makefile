PROJECT_PUBLIC_URL=https://geomapfish-demo-2-8.camptocamp.com/
DUMP_FILE=data/prod-2-7.dump
PACKAGE=geomapfish
LANGUAGES=en fr de it

.PHONY: help
help: ## Display this help message
	@echo "Usage: make <target>"
	@echo
	@echo "Available targets:"
	@grep --extended-regexp --no-filename '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "	%-20s%s\n", $$1, $$2}'

.PHONY: update-po-from-url
update-po-from-url: ## Update the po files from the URL provide by PROJECT_PUBLIC_URL
	curl --fail --retry 5 --retry-delay 1 \
		$(PROJECT_PUBLIC_URL)locale.pot > geoportal/${PACKAGE}_geoportal/locale/${PACKAGE}_geoportal-client${SUFFIX}.pot
	sed -i '/^"POT-Creation-Date: /d' geoportal/${PACKAGE}_geoportal/locale/${PACKAGE}_geoportal-client${SUFFIX}.pot
	docker compose run --rm -T tools update-po-only `id --user` `id --group` $(LANGUAGES)

.PHONY: update-po
update-po: ## Update the po files from the running composition
	docker compose exec -T tools sh -c "USER_ID=`id --user` GROUP_ID=`id --group` make --directory=geoportal update-po"

.PHONY: checks
checks: prospector eslint ## Runs the checks

.PHONY: prospector
prospector: ## Runs the Prospector checks
	docker compose run --entrypoint= --rm --volume=$(CURDIR)/geoportal:/app geoportal \
		prospector --output-format=pylint --die-on-tool-error
	docker build --tag=custom-checks --target=checks custom
	docker run --rm custom-checks prospector --output-format=pylint --die-on-tool-error

.PHONY: eslint
eslint: ## Runs the eslint checks
	docker compose run --entrypoint= --no-deps --rm --volume=$(CURDIR)/geoportal:/app geoportal \
		eslint $(find geomapfish -type f -name '*.js' -print 2> /dev/null)
	docker compose run --entrypoint= --no-deps --rm --volume=$(CURDIR)/geoportal:/app geoportal \
		eslint $(find geomapfish -type f -name '*.ts' -print 2> /dev/null)

.PHONY: build
build:
	./build

.PHONY: qgis
qgis: ## Run QGIS desktop
	docker compose -f docker-compose.yaml -f docker-compose-qgis.yaml run --rm qgis

secrets.tar.bz2.gpg: env.secrets secrets.md ## Encrypt the secrets for committing changes
	tar -jcf secrets.tar.bz2 $^
	rm -f $@
	gpg --symmetric --cipher-algo AES256 --batch \
		--passphrase=$(shell gopass show gs/ci/large-secret-passphrase) secrets.tar.bz2
	rm secrets.tar.bz2

.PHONY: secrets
secrets: ## Decrypt the secrets.tar.bz2.gpg file
	gpg --quiet --batch --yes --decrypt --passphrase=$(shell gopass show gs/ci/large-secret-passphrase) \
		--output secrets.tar.bz2 secrets.tar.bz2.gpg
	tar --touch -jxf secrets.tar.bz2
	rm secrets.tar.bz2

.PHONY: acceptance-init
acceptance-init: ## Initialize the acceptance tests
	cat env.acceptance-test >> .env
	docker volume rm demo_postgresql_data || true
	docker compose --file=docker-compose.yaml --file=docker-compose-db.yaml up -d db tools
	docker compose exec -T tools wait-db
	docker compose exec -T tools psql --command='CREATE EXTENSION IF NOT EXISTS postgis'
	docker compose exec -T tools psql --command='CREATE EXTENSION IF NOT EXISTS pg_trgm'
	docker compose exec -T tools psql --command='CREATE EXTENSION IF NOT EXISTS hstore'
	scripts/db-restore --docker-compose-file=docker-compose.yaml --docker-compose-file=docker-compose-db.yaml \
		--arg=--clean --arg=--if-exists --arg=--verbose --arg=--no-privileges --arg=--no-owner $(DUMP_FILE) || true
	docker compose --file=docker-compose.yaml --file=docker-compose-db.yaml up -d

.PHONY: acceptance
acceptance: ## Run the acceptance tests
	docker compose exec -T tools pytest -vv tests/
	ci/docker-compose-check

.PHONY: acceptance-dev
acceptance-dev:
	docker compose --file=docker-compose.yaml --file=docker-compose-db.yaml --file=docker-compose.override.sample.yaml up -d
	sleep 2
	docker compose exec -T tools pytest tests/
	ci/docker-compose-check
