from  datetime import date, datetime
from sqlmodel import Field, SQLModel

class Task(SQLModel, table=True):
    id: int | None=Field(default=None, primary_key=True)
    title: str
    date:date
    done: bool=False
    created_at:datetime=Field(default_factory=datetime.utcnow)

    