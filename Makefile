BUILD_OPTIONS = --config

.PHONY: build
build:
	./build $(BUILD_OPTIONS)


GPG_KEYS += 5E026E27C9F78F65223CB546B39FC793D1D6A94C # Stéphane Brunner
GPG_KEYS += 4FD73D10A46019C49C844CF9E29282A0CF8E9976 # Guillaume Beraudo
GPG_KEYS += 1C3E8BAD07E68AF2E15D7C2A3C193EAE3EA11D26 # Elisabeth Leu
GPG_KEYS += 933FFD84E4EB0E12B7B5D0C8EDCE1D2A0875810F # Frederic Junod
GPG_KEYS += 14B0A8BBEF59FB4984E1A91D0F85749A1DAFEE6A # Oliver Christen
GPG_KEYS += 7F816541422C98E9A21CC2C3E9461427C8A0FF72 # Wolfgang Kaltz
GPG_KEYS += 4E98BB3AD36285EFDA47B83B4662C60FA510717D # Michael Künzli
GPG_KEYS += 1AC7B924F73B4C4A302F39E6EA57F57AA68C2F5F # Arnaud Morvan
GPG_KEYS += 0545262E5AE04436C83B654D4CEC60DAC4F68132 # Andrea Borghi
GPG_KEYS += B3771480D024F905F6FA4637BE875E27AAA3DDF0 # Renata Mueller
GPG_KEYS += 855DF5F3 # Alexandre Saunier
GPG_KEYS += A90D3D812D4FA142 # Ismail Sunni

secrets.tar.bz2.gpg: env.secrets secrets.md
	tar -jcf secrets.tar.bz2 $^
	gpg --keyserver-options timeout=20 --recv-keys $(GPG_KEYS) || true
	rm -f $@
	gpg --always-trust --output $@ --encrypt $(addprefix --recipient ,$(GPG_KEYS)) secrets.tar.bz2
	rm secrets.tar.bz2

.PHONY: secrets
secrets:
	gpg --output secrets.tar.bz2 --decrypt secrets.tar.bz2.gpg
	tar --touch -jxf secrets.tar.bz2
	rm secrets.tar.bz2
