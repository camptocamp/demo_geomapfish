GeoMapFish demo project
=======================

Read the `Documentation <https://camptocamp.github.io/c2cgeoportal/2.9/>`_

Checkout
--------

.. code::

   git clone git@github.com:camptocamp/demo_geomapfish.git
   cd demo_geomapfish

Build
-----

Follow the README of https://github.com/camptocamp/geospatial-ci-pass#install-gopass-locally to install
gopass and init gopass with the store `gs/ci`. Then run:

.. code::

  make secrets
  ./build

Run locally
-----------

.. code::

  docker-compose up -d

The demo is accessible at https://localhost:8484/ or (https://localhost:8484/<interface>)

Notes
----

If you use the default database (as configured in the env.project file), you must enable the Camptocamp VPN.

If you modify the content of the `geoportal` folder and want to use these changes, you must comment this line to use the correct image with you local composition: https://github.com/camptocamp/demo_geomapfish/blob/a319b78a0a381204ff90bf4d9dd5ab8fa60f4e95/docker-compose.yaml#L100
