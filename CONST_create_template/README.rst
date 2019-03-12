demo_geomapfish project
===================

Read the `Documentation <https://camptocamp.github.io/c2cgeoportal/2.4/>`_

Checkout
--------

.. code::

   git clone git@github.com:camptocamp/demo_geomapfish.git

   cd demo_geomapfish

Build
-----

.. code::

  ./docker-run make --makefile=<user.mk> build

If you want to work on your own instance, create a ${USER}.mk file like that:

.. script::

  INSTANCE=myUserName
  include Makefile

Run
---

.. code::

   docker-compose up

.. Feel free to add project-specific things.
