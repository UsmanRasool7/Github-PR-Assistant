# app/db/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional
from sqlalchemy import func

# Repositories
def create_repository(db: Session, repo: schemas.RepositoryCreate) -> models.Repository:
    db_repo = models.Repository(full_name=repo.full_name, default_branch=repo.default_branch)
    db.add(db_repo)
    db.commit()
    db.refresh(db_repo)
    return db_repo

def get_repository(db: Session, repo_id: int) -> Optional[models.Repository]:
    return db.query(models.Repository).filter(models.Repository.id == repo_id).first()

def get_repository_by_fullname(db: Session, full_name: str) -> Optional[models.Repository]:
    return db.query(models.Repository).filter(models.Repository.full_name == full_name).first()

def list_repositories(db: Session, skip: int = 0, limit: int = 100) -> List[models.Repository]:
    return db.query(models.Repository).offset(skip).limit(limit).all()

# Reviews (PRs)
def create_review(db: Session, review_in: schemas.ReviewCreate) -> models.PullRequestReview:
    db_review = models.PullRequestReview(
        pr_number=review_in.pr_number,
        title=review_in.title,
        author=review_in.author,
        repo_id=review_in.repo_id,
        status=models.ReviewStatus.pending
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_review(db: Session, review_id: int) -> Optional[models.PullRequestReview]:
    return db.query(models.PullRequestReview).filter(models.PullRequestReview.id == review_id).first()

def get_review_by_pr(db: Session, repo_id: int, pr_number: int) -> Optional[models.PullRequestReview]:
    return db.query(models.PullRequestReview).filter(
        models.PullRequestReview.repo_id == repo_id,
        models.PullRequestReview.pr_number == pr_number
    ).first()

def update_review(db: Session, review: models.PullRequestReview, patch: schemas.ReviewUpdate) -> models.PullRequestReview:
    if patch.status is not None:
        review.status = patch.status
    if patch.summary is not None:
        review.summary = patch.summary
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def delete_review(db: Session, review: models.PullRequestReview):
    db.delete(review)
    db.commit()

def list_reviews(db: Session, repo_id: Optional[int] = None, status: Optional[str] = None, skip: int = 0, limit: int = 20):
    q = db.query(models.PullRequestReview)
    if repo_id:
        q = q.filter(models.PullRequestReview.repo_id == repo_id)
    if status:
        q = q.filter(models.PullRequestReview.status == status)
    total = q.count()
    items = q.order_by(models.PullRequestReview.created_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "items": items}

def get_dashboard_stats(db: Session):
    total_repos = db.query(func.count(models.Repository.id)).scalar()
    total_reviews = db.query(func.count(models.PullRequestReview.id)).scalar()
    per_status = db.query(models.PullRequestReview.status, func.count(models.PullRequestReview.id)).group_by(models.PullRequestReview.status).all()
    return {
        "total_repositories": total_repos,
        "total_reviews": total_reviews,
        "reviews_by_status": {status.value: count for status, count in per_status}
    }
