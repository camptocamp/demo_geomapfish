BUILD_OPTIONS = --config

.PHONY: build
build:
	./build $(BUILD_OPTIONS)

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

.PHONY: update-po
update-po:
	docker-compose exec tools sh -c "USER_ID=`id --user` GROUP_ID=`id --group` make -C geoportal update-po"
