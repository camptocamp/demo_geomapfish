demo_geomapfish project
===================

Read the `Documentation <https://camptocamp.github.io/c2cgeoportal/2.5/>`_

Checkout
--------

.. code::

   git clone git@github.com:camptocamp/demo_geomapfish.git

   cd demo_geomapfish

Build
-----

.. code::

  cp .env.sample .env
  docker build --tag=camptocamp/demo-geoportal --build-arg=GIT_HASH=$(git rev-parse HEAD) geoportal
  docker build --tag=camptocamp/demo-config --build-arg=PGSCHEMA=main .

Run
---

.. code::

   docker-compose up -d

.. Feel free to add project-specific things.
