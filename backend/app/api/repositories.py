# app/api/repositories.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import crud, schemas, models
from ..db.database import get_db

router = APIRouter(prefix="/api/repositories", tags=["repositories"])

@router.post("/", response_model=schemas.RepositoryOut)
def create_repository(repo_in: schemas.RepositoryCreate, db: Session = Depends(get_db)):
    existing = crud.get_repository_by_fullname(db, repo_in.full_name)
    if existing:
        raise HTTPException(status_code=400, detail="Repository already exists")
    return crud.create_repository(db, repo_in)

@router.get("/", response_model=list[schemas.RepositoryOut])
def list_repositories(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return crud.list_repositories(db, skip=skip, limit=limit)
