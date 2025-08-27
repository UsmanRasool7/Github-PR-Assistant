# app/db/models.py
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base

class ReviewStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    done = "done"
    failed = "failed"

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, unique=True, index=True)   # e.g. "owner/repo"
    default_branch = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

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
