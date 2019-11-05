GPG_KEYS += D1D6A94C # Stéphane Brunner
GPG_KEYS += B42AF223 # Patrick Valsecchi
GPG_KEYS += C27D570B # Roman Zoller
GPG_KEYS += CF8E9976 # Guillaume Beraudo
GPG_KEYS += 3EA11D26 # Elisabeth Leu
GPG_KEYS += 0875810F # Frederic Junod
GPG_KEYS += 1DAFEE6A # Oliver Christen
GPG_KEYS += C8A0FF72 # Wolfgang Kaltz
GPG_KEYS += A510717D # Michael Künzli
GPG_KEYS += A68C2F5F # Arnaud Morvan
GPG_KEYS += 855DF5F3 # Alexandre Saunier

secrets.tar.bz2.gpg: .env.secrets secrets.md
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
