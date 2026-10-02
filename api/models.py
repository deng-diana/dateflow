from datetime import date as Date
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class TaskBase(SQLModel):
    title:str
    date:Date
    done:bool=False


class Task(TaskBase, table=True):
    id: int | None=Field(default=None, primary_key=True)
    created_at:datetime=Field(default_factory=lambda: datetime.now(timezone.utc))

class TaskCreate(TaskBase):
     """What the client sends. No id, no created_at."""

class TaskUpdate(SQLModel):
     """Every field optional: send only what changes."""
     title: str| None=None
     date: Date| None=None
     done: bool | None = None

class Message(SQLModel, table=True):
    id:int | None=Field(default=None, primary_key=True)
    role: str = Field(schema_extra={"json_schema_extra": {"enum": ["user", "assistant"]}})
    content:str
    created_at:datetime=Field(default_factory=lambda: datetime.now(timezone.utc))


class Memory(SQLModel, table=True):
    id:int | None=Field(default=None, primary_key=True)
    content:str
    created_at:datetime=Field(default_factory=lambda:datetime.now(timezone.utc))