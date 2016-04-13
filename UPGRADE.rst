Start to create a new c2cgeoportal devlopement release:
https://camptocamp.github.io/c2cgeoportal/master/developer/build_release.html#id2

Do the upgrade in your home folder:
https://camptocamp.github.io/c2cgeoportal/master/integrator/upgrade_application.html#easy-upgrading-an-application

Before the step 2 you should get some files from the create template:

.. code::

   cp /tmp/demo_geomapfish/demo/templates/mobile.html demo/templates/
   cp /tmp/demo_geomapfish/demo/static-ngeo/js/mobile.js demo/static-ngeo/js/
   cp /tmp/demo_geomapfish/demo/templates/desktop.html demo/templates/
   cp /tmp/demo_geomapfish/demo/static-ngeo/js/desktop.js demo/static-ngeo/js/

Before the step 3, complete the files:

    demo/locale/*/LC_MESSAGES/demo-client.po


Do the update in the common folder:
https://camptocamp.github.io/c2cgeoportal/master/integrator/upgrade_application.html#easy-updating-an-application-code
https://camptocamp.github.io/c2cgeoportal/master/integrator/deploy.html?highlight=sigdev#shared-environement
