# app/db/schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ReviewStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    done = "done"
    failed = "failed"

# Repository schemas
class RepositoryCreate(BaseModel):
    full_name: str
    default_branch: Optional[str] = None

class RepositoryOut(BaseModel):
    id: int
    full_name: str
    default_branch: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Pull request review schemas
class ReviewCreate(BaseModel):
    pr_number: int
    title: Optional[str] = None
    author: Optional[str] = None
    repo_id: int

class ReviewUpdate(BaseModel):
    status: Optional[ReviewStatus] = None
    summary: Optional[str] = None

class ReviewOut(BaseModel):
    id: int
    pr_number: int
    title: Optional[str]
    author: Optional[str]
    repo_id: int
    status: ReviewStatus
    summary: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Paginated response for reviews
class ReviewListResponse(BaseModel):
    total: int
    items: List[ReviewOut]
