# DateFlow API. Health check first; task routes come next.
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from db import engine, init_db
from models import (
    Task,
    TaskCreate,
    TaskUpdate,
)

app=FastAPI(title="DateFlow API")



def get_task_or_404(session: Session, task_id:int)->Task:
    task=session.get(Task, task_id)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@app.on_event("startup")
def on_startup():
    init_db()


# Allow the Next.js dev server to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/tasks")
def list_tasks()->list[Task]:
    with Session(engine) as session:
        return session.exec(select(Task).order_by(Task.date)).all()


@app.post("/tasks", status_code=201)
def create_task(payload: TaskCreate)-> Task:
    task=Task.model_validate(payload)
    with Session(engine) as session:
        session.add(task)
        session.commit()
        session.refresh(task)
        return task     



@app.patch("/tasks/{task_id}")
def update_task(task_id: int, payload: TaskUpdate) -> Task:
    with Session(engine) as session:
        task=get_task_or_404(session, task_id)
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(task, key, value)
        session.add(task)
        session.commit()
        session.refresh(task)
        return task

@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int)->None:
    with Session(engine) as session:
        task=get_task_or_404(session, task_id)
        session.delete(task)
        session.commit()
