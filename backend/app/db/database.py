# app/db/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# If using SQLite the connect_args is required; for Postgres it's ignored.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

# create_engine supports URLs like:
# postgresql+psycopg2://user:pass@host:port/dbname
engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args=connect_args,
    pool_pre_ping=True,   # avoids stale connections
    # Optional: tune pool_size/max_overflow in production
    # pool_size=10,
    # max_overflow=20,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency function for FastAPI endpoints
def get_db():
    """Database dependency that yields a session and closes it when done"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
