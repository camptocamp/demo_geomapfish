Start to create a new c2cgeoportal development release:
https://camptocamp.github.io/c2cgeoportal/master/developer/build_release.html

Do the upgrade in your home folder:
https://camptocamp.github.io/c2cgeoportal/master/integrator/upgrade_application.html

And add the argument `--share /var/sig/` to the `docker-run` commands.

=> use the command:
./docker-run --home make --makefile=sbrunner23.mk upgrade


After upgrade:

run:
./docker-run make -f sbrunner23.mk update-po

complete the files:
    geoportal/demo/locale/*/LC_MESSAGES/demo-*.po

run:
git add geoportal/demo/locale/*/LC_MESSAGES/demo-*.po
git commit -m "Update the localisation"

run:
./docker-run make -f sbrunner23.mk theme2fts
