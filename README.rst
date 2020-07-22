GeoMapFish demo project
=======================

Read the `Documentation <https://camptocamp.github.io/c2cgeoportal/master/>`_

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

Note
----

If you use the default database (as configured in the env.project file), you must enable the Camptocamp VPN.
