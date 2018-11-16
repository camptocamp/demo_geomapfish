Start to create a new c2cgeoportal development release:
https://camptocamp.github.io/c2cgeoportal/master/developer/build_release.html

In order to push the image and dockerhub create a new branch based on the tag created

Do the upgrade in your home folder:
https://camptocamp.github.io/c2cgeoportal/master/integrator/upgrade_application.html

=> use the command:

.. code::

   ./docker-run --share /var/sig/ --home make --makefile=<makefile> upgrade


After upgrade:

run:

.. code::

   ./docker-run --share /var/sig/ make update-po

complete the files:  geoportal/demo/locale/*/LC_MESSAGES/demo-*.po

run:

.. code::

   git add geoportal/demo/locale/*/LC_MESSAGES/demo-*.po
   git commit -m "Update the localisation"

run:

.. code::

   ./docker-run make theme2fts

When it's working publish it to the main demo:

.. code::

   /scripts/publish <instance>
