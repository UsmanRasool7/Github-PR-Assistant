# app/main.py
from fastapi import FastAPI
from .api import reviews, repositories, dashboard, health
from .db import models
from .db.database import engine

app = FastAPI(title="PR Assistant API")

# create tables (for quick dev); migrations are recommended for production
models.Base.metadata.create_all(bind=engine)

app.include_router(repositories.router)
app.include_router(reviews.router)
app.include_router(dashboard.router)
app.include_router(health.router)
