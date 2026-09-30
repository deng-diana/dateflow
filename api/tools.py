# Tools the agent can call. Each has a JSON description for the model
# and a Python function that actually does the work.
from datetime import date as Date
from sqlmodel import Session, select

from db import engine
from models import Task

TOOLS = [
    {
        "name": "create_task",
        "description": "Create a new task on a given date.",
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "date": {"type": "string", "description": "YYYY-MM-DD"},
            },
            "required": ["title", "date"],
        },
    },
    {
        "name": "list_tasks",
        "description": "List all tasks, optionally only for one date.",
        "input_schema": {
            "type": "object",
            "properties": {"date": {"type": "string", "description":"YYYY-MM-DD"}},
        },
    },
    {
        "name": "complete_task",
        "description": "Mark a task as done by its id.",
        "input_schema": {
            "type": "object",
            "properties": {"task_id": {"type": "integer"}},
            "required": ["task_id"],
        },
    },
]


def run_tool(name: str, args: dict) -> dict:
    """Execute one tool call and return a JSON-friendly result."""
    with Session(engine) as session:
        if name == "create_task":
            task = Task(title=args["title"],date=Date.fromisoformat(args["date"]))
            session.add(task)
            session.commit()
            session.refresh(task)
            return task.model_dump(mode="json")

        if name == "list_tasks":
            query = select(Task).order_by(Task.date)
            if args.get("date"):
                query = query.where(Task.date == Date.fromisoformat(args["date"]))
            return {"tasks": [t.model_dump(mode="json") for t in session.exec(query)]}

        if name == "complete_task":
            task = session.get(Task, args["task_id"])
            if task is None:
                return {"error": "Task not found"}
            task.done = True
            session.add(task)
            session.commit()
            session.refresh(task)
            return task.model_dump(mode="json")

    return {"error": f"Unknown tool: {name}"}