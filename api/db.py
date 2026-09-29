# Database connection. Creates tables on startup for now; migrations come later.
from sqlmodel import SQLModel, create_engine
import os

DATABASE_URL = "postgresql+psycopg://postgres:dateflow@localhost:5432/dateflow"
engine=create_engine(DATABASE_URL)
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:dateflow@localhost:5432/dateflow",
)

def init_db() -> None:
    SQLModel.metadata.create_all(engine)