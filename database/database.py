"""
SQLite Database Connection
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker


DATABASE_URL = "sqlite:///database/autoheal.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def initialize_database():
    """
    Create all database tables.
    """

    # Import models here to avoid circular imports
    from database import models

    Base.metadata.create_all(bind=engine)

    print("✅ Database Initialized")