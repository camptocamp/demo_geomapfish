"""Alembic environment configuration using environment variables."""

import os

from alembic import context  # pylint: disable=no-member
from sqlalchemy import create_engine

from custom.models.meta import Base

config = context.config  # pylint: disable=no-member

target_metadata = Base.metadata


def get_database_url() -> str:
    """Get database URL from environment variables."""
    return os.environ.get("CUSTOM__SQLALCHEMY_URL", os.environ.get("SQLALCHEMY_URL", ""))


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
    url = get_database_url()
    context.configure(url=url, target_metadata=target_metadata)  # pylint: disable=no-member
    with context.begin_transaction():  # pylint: disable=no-member
        context.run_migrations()  # pylint: disable=no-member


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.
    """
    url = get_database_url()
    engine = create_engine(url)
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
