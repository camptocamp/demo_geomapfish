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
  ./build --pgschema main_2_5 env.sample env.secrets

Run locally
-----------

.. code::

  docker-compose up -d
