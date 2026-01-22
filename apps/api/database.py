from sqlmodel import SQLModel, Session, create_engine
from typing import Generator

# SQLite database file path (relative to apps/api)
DATABASE_URL = "sqlite:///./finance.db"

# Create engine with SQLite-specific settings
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    connect_args={"check_same_thread": False}  # Required for SQLite with FastAPI
)


def create_db_and_tables() -> None:
    """Create all database tables defined in SQLModel metadata."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency that provides a database session.
    Yields a session and ensures it's closed after use.
    """
    with Session(engine) as session:
        yield session
