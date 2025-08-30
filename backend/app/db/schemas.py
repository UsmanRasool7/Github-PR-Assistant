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

# User schemas
class UserCreate(BaseModel):
    github_id: int
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    github_access_token: Optional[str] = None

class UserOut(BaseModel):
    id: int
    github_id: int
    username: str
    email: Optional[str]
    full_name: Optional[str]
    avatar_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    github_access_token: Optional[str] = None

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    username: Optional[str] = None

# Repository schemas
class RepositoryCreate(BaseModel):
    github_id: Optional[int] = None
    full_name: str
    name: Optional[str] = None
    description: Optional[str] = None
    default_branch: Optional[str] = None
    is_private: Optional[bool] = False

class RepositoryOut(BaseModel):
    id: int
    github_id: Optional[int]
    full_name: str
    name: Optional[str]
    description: Optional[str]
    default_branch: Optional[str]
    is_private: bool
    user_id: Optional[int]
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

# Dashboard schemas
class DashboardStats(BaseModel):
    total_repositories: int
    total_reviews: int
    active_pull_requests: int
