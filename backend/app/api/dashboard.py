# app/api/dashboard.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..db import crud

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)
