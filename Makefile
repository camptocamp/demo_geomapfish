PROJECT_PUBLIC_URL=https://geomapfish-demo-2-7.camptocamp.com/
PACKAGE=geomapfish
LANGUAGES=en fr de it

.PHONY: update-po-from-url
update-po-from-url:
	curl $(PROJECT_PUBLIC_URL)locale.pot > geoportal/${PACKAGE}_geoportal/locale/${PACKAGE}_geoportal-client${SUFFIX}.pot
	sed -i '/^"POT-Creation-Date: /d' geoportal/${PACKAGE}_geoportal/locale/${PACKAGE}_geoportal-client${SUFFIX}.pot
	docker-compose run --rm -T tools update-po-only `id --user` `id --group` $(LANGUAGES)

.PHONY: update-po
update-po:
	docker-compose exec -T tools sh -c "USER_ID=`id --user` GROUP_ID=`id --group` make -C geoportal update-po"

.PHONY: build
build:
	./build --config

secrets.tar.bz2.gpg: env.secrets secrets.md
	tar -jcf secrets.tar.bz2 $^
	rm -f $@
	gpg --symmetric --cipher-algo AES256 --batch \
		--passphrase=$(shell gopass gs/ci/large-secret-passphrase) secrets.tar.bz2
	rm secrets.tar.bz2

.PHONY: secrets
secrets:
	gpg --quiet --batch --yes --decrypt --passphrase=$(shell gopass gs/ci/large-secret-passphrase) \
		--output secrets.tar.bz2 secrets.tar.bz2.gpg
	tar --touch -jxf secrets.tar.bz2
	rm secrets.tar.bz2

.PHONY: qgis
qgis: ## Run QGIS desktop
	docker-compose -f docker-compose.yaml -f docker-compose-qgis.yaml run --rm qgis
