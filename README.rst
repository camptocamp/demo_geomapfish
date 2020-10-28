GeoMapFish demo project
=======================

Read the `Documentation <https://camptocamp.github.io/c2cgeoportal/2.5/>`_

Checkout
--------

.. code::

   git clone git@github.com:camptocamp/demo_geomapfish.git
   cd demo_geomapfish

Build
-----

.. code::

  make secrets
  ./build

Run locally
-----------

.. code::

  docker-compose up -d
  
  The demo is accessible at https://localhost:8484/ or (https://localhost:8484/<interface>)

Notes
-----

If you use the default database (as configured in the env.project file), you must enable the Camptocamp VPN.

If you modify the content of the `geoportal` folder and want to use these changes, you must comment this line to use the correct image with you local composition: https://github.com/camptocamp/demo_geomapfish/blob/6cdf9efd954cc2134b838db434e4fdeab1d46c6f/docker-compose.yaml#L74
