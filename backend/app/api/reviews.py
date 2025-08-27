# app/api/reviews.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ..db import crud, schemas, models
from ..db.database import get_db
from typing import Optional
from ..services.review import make_summary  # reuse your existing function

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

@router.post("/", response_model=schemas.ReviewOut)
def create_review(review_in: schemas.ReviewCreate, db: Session = Depends(get_db), background_tasks: BackgroundTasks = None):
    # create row, then kick off background summary generation (optional)
    repo = crud.get_repository(db, review_in.repo_id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")
    existing = crud.get_review_by_pr(db, review_in.repo_id, review_in.pr_number)
    if existing:
        raise HTTPException(status_code=400, detail="Review for this PR already exists")
    review = crud.create_review(db, review_in)

    # optional: background job to generate summary using make_summary (or put into your webhook flow)
    if background_tasks is not None:
        # we call make_summary in background; it returns text (sync) so ensure it runs in threadpool if heavy
        def _generate_and_attach(pr_id: int, db_id: int):
            try:
                text = make_summary(pr_id)
                # Update DB with summary
                from ..db.database import SessionLocal
                db2 = SessionLocal()
                try:
                    r = db2.query(models.PullRequestReview).get(db_id)
                    if r:
                        r.summary = text
                        r.status = models.ReviewStatus.done
                        db2.add(r)
                        db2.commit()
                finally:
                    db2.close()
            except Exception as e:
                print("error generating summary", e)

        background_tasks.add_task(_generate_and_attach, review.pr_number, review.id)

    return review

@router.get("/", response_model=dict)
def list_reviews(repo_id: Optional[int] = None, status: Optional[str] = None, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return crud.list_reviews(db, repo_id=repo_id, status=status, skip=skip, limit=limit)

@router.get("/{review_id}", response_model=schemas.ReviewOut)
def get_review(review_id: int, db: Session = Depends(get_db)):
    r = crud.get_review(db, review_id)
    if not r:
        raise HTTPException(status_code=404, detail="Review not found")
    return r

@router.put("/{review_id}", response_model=schemas.ReviewOut)
def update_review(review_id: int, patch: schemas.ReviewUpdate, db: Session = Depends(get_db)):
    r = crud.get_review(db, review_id)
    if not r:
        raise HTTPException(status_code=404, detail="Review not found")
    return crud.update_review(db, r, patch)

@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    r = crud.get_review(db, review_id)
    if not r:
        raise HTTPException(status_code=404, detail="Review not found")
    crud.delete_review(db, r)
    return {"ok": True}
