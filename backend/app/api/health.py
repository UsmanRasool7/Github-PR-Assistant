# app/api/health.py
from fastapi import APIRouter
from ..db.database import engine

router = APIRouter(prefix="/api", tags=["health"])

@router.get("/health")
def health_check():
    try:
        # quick check: connect
        conn = engine.connect()
        conn.close()
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        return {"status": "fail", "db": str(e)}
