Start to create a new c2cgeoportal development release:
https://camptocamp.github.io/c2cgeoportal/master/developer/build_release.html

In order to push the image and dockerhub create a new branch based on the tag created

Do the upgrade in your home folder:
https://camptocamp.github.io/c2cgeoportal/master/integrator/upgrade_application.html

=> use the command:

.. code::

   ./docker-run --home make upgrade

After upgrade:

run:

.. code::

   ./docker-compose-run make update-po

complete the files:  geoportal/demo/locale/*/LC_MESSAGES/demo-*.po

run:

.. code::

   git add geoportal/demo/locale/*/LC_MESSAGES/demo-*.po
   git commit -m "Update the localisation"

run:

.. code::

   ./docker-compose-run make theme2fts
