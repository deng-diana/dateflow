# DateFlow API. Health check first; task routes come next.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import init_db
import models  # noqa: F401  (registers the Task table before create_all)
app=FastAPI(title="DateFlow API")


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