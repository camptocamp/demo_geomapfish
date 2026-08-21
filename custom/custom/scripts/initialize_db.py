import os
import sys

from sqlalchemy import Engine, create_engine
from sqlalchemy.exc import OperationalError

from custom.models.meta import Base


def setup_models(engine: Engine) -> None:
    """Add or update models / fixtures in the database."""
    Base.metadata.create_all(engine)


def main(argv: list[str] | None = None) -> None:
    del argv
    url = os.environ.get("CUSTOM__SQLALCHEMY_URL", os.environ.get("SQLALCHEMY_URL", ""))
    if not url:
        print("Error: SQLALCHEMY_URL or CUSTOM__SQLALCHEMY_URL environment variable is required")
        sys.exit(1)

    try:
        engine = create_engine(url)
        setup_models(engine)
    except OperationalError:
        print(
            """
Error connecting to the database. Check that:

1. The database server is running.
2. The SQLALCHEMY_URL environment variable is correct.
3. Database tables have been initialized with alembic.
            """,
        )
        sys.exit(1)
