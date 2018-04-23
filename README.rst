demo_geomapfish project
===================

Read the `Documentation <http://docs.camptocamp.net/c2cgeoportal/>`_

Checkout
--------

.. script::

   git clone git@github.com:camptocamp/demo_geomapfish.git

Build
-----

.. script::

  cd demo_geomapfish

  ./docker-run make build

.. Feel free to add project-specific things.


Run locally
-----------

You may need to setup a tunnel for the DB:

.. script::

  ssh -L 172.17.0.1:5432:localhost:5432 geomapfish-demo.camptocamp.com

Then, to start:

.. script::

  docker-compose up
