# app/db/models.py
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base

class ReviewStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    done = "done"
    failed = "failed"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    github_access_token = Column(String, nullable=True)  # Encrypted in production
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    repositories = relationship("Repository", back_populates="user")

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True, nullable=True)  # GitHub repo ID
    full_name = Column(String, unique=True, index=True)   # e.g. "owner/repo"
    name = Column(String, nullable=True)  # Just the repo name
    description = Column(String, nullable=True)
    default_branch = Column(String, nullable=True)
    is_private = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Owner of the repo
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="repositories")
    pull_requests = relationship("PullRequestReview", back_populates="repository", cascade="all, delete-orphan")

class PullRequestReview(Base):
    __tablename__ = "pull_request_reviews"

    id = Column(Integer, primary_key=True, index=True)
    pr_number = Column(Integer, index=True)         # PR number in GitHub
    title = Column(String, nullable=True)
    author = Column(String, nullable=True)
    repo_id = Column(Integer, ForeignKey("repositories.id"))
    status = Column(Enum(ReviewStatus), default=ReviewStatus.pending)
    summary = Column(Text, nullable=True)           # AI-generated summary text
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    repository = relationship("Repository", back_populates="pull_requests")
