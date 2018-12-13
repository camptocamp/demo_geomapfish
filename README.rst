demo_geomapfish project
===================

Read the `Documentation <https://camptocamp.github.io/c2cgeoportal/2.4/>`_

Checkout
--------

.. script::

   git clone git@github.com:camptocamp/demo_geomapfish.git

   cd demo_geomapfish

Build
-----

.. script::

  make secrets

  ./docker-run make build

If you want to work on your own instance, create a ${USER}.mk file like that:

.. script::

  INSTANCE=myUserName
  include Makefile

.. Feel free to add project-specific things.


Run locally
-----------

You may need to setup a tunnel for the DB:

.. script::

  ssh -L 172.17.0.1:5432:localhost:5432 geomapfish-demo.camptocamp.com

Then, to start:

.. script::

  docker-compose up

If the project is configured with a global front (for being able the run more than one instance at the same
time:

.. script::

  (cd global-front; docker-compose -p global up --build)
