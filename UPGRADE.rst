Start to create a new c2cgeoportal development release:
https://camptocamp.github.io/c2cgeoportal/master/developer/build_release.html#id2

Do the upgrade in your home folder:
https://camptocamp.github.io/c2cgeoportal/master/integrator/upgrade_application.html#easy-upgrading-an-application

Before the step 3 you should get some files from the create template:

.. code::

   cp CONST_create_template/demo/templates/mobile.html demo/templates/
   cp CONST_create_template/demo/static-ngeo/js/mobile.js demo/static-ngeo/js/
   cp CONST_create_template/demo/templates/desktop.html demo/templates/
   cp CONST_create_template/demo/static-ngeo/js/desktop.js demo/static-ngeo/js/

Before the step 5, complete the files:

    demo/locale/*/LC_MESSAGES/demo-client.po


Do the update in the common folder:
https://camptocamp.github.io/c2cgeoportal/master/integrator/upgrade_application.html#easy-updating-an-application-code
https://camptocamp.github.io/c2cgeoportal/master/integrator/deploy.html?highlight=sigdev#shared-environement
