# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import reviews, repositories, dashboard, health
from .db import models
from .db.database import engine

app = FastAPI(title="PR Assistant API", redirect_slashes=False)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React app origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# create tables (for quick dev); migrations are recommended for production
models.Base.metadata.create_all(bind=engine)

app.include_router(repositories.router)
app.include_router(reviews.router)
app.include_router(dashboard.router)
app.include_router(health.router)
