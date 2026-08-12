# Copyright (c) 2019-2026, Camptocamp SA
"""Pyramid bootstrap environment."""

from alembic import context  # pylint: disable=no-member
from pyramid.paster import get_appsettings, setup_logging  # type: ignore[import-untyped]
from sqlalchemy import engine_from_config

from custom.models.meta import Base

config = context.config  # pylint: disable=no-member

setup_logging(config.config_file_name)

settings = get_appsettings(config.config_file_name)
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    context.configure(url=settings["sqlalchemy.url"])  # pylint: disable=no-member
    with context.begin_transaction():  # pylint: disable=no-member
        context.run_migrations()  # pylint: disable=no-member


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    engine = engine_from_config(settings, prefix="sqlalchemy.")

    connection = engine.connect()
    context.configure(connection=connection, target_metadata=target_metadata)  # pylint: disable=no-member

    try:
        with context.begin_transaction():  # pylint: disable=no-member
            context.run_migrations()  # pylint: disable=no-member
    finally:
        connection.close()


if context.is_offline_mode():  # pylint: disable=no-member
    run_migrations_offline()
else:
    run_migrations_online()
