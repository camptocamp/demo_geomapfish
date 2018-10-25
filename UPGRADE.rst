Start to create a new c2cgeoportal development release:
https://camptocamp.github.io/c2cgeoportal/master/developer/build_release.html

Do the upgrade in your home folder:
https://camptocamp.github.io/c2cgeoportal/master/integrator/upgrade_application.html

And add the argument `--share /var/sig/` to the `docker-run` commands.

=> use the command:

.. code::

   ./docker-run --home make --makefile=<makefile> upgrade


After upgrade:

run:

.. code::

   ./docker-run make update-po

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
