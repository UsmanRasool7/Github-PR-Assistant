#!/usr/bin/env python3
"""Script to add test data to the database."""

from datetime import datetime
from database import SessionLocal, engine
import models

def create_test_data():
    """Create sample repositories and reviews for testing."""
    db = SessionLocal()
    
    try:
        # Create test repositories
        repos = [
            models.Repository(
                name="awesome-web-app",
                url="https://github.com/user/awesome-web-app",
                description="A modern web application built with React and FastAPI"
            ),
            models.Repository(
                name="ml-pipeline",
                url="https://github.com/user/ml-pipeline", 
                description="Machine learning pipeline for data processing"
            ),
            models.Repository(
                name="api-gateway",
                url="https://github.com/user/api-gateway",
                description="Microservices API gateway with rate limiting"
            )
        ]
        
        for repo in repos:
            db.add(repo)
        
        db.commit()
        
        # Get the created repositories
        created_repos = db.query(models.Repository).all()
        
        # Create test reviews
        reviews = [
            models.PullRequestReview(
                repository_id=created_repos[0].id,
                pr_number=123,
                title="Add user authentication system",
                description="Implements JWT-based authentication with refresh tokens",
                author="john_doe",
                status=models.ReviewStatus.pending,
                summary="This PR adds a comprehensive authentication system using JWT tokens. The implementation includes user registration, login, logout, and token refresh functionality."
            ),
            models.PullRequestReview(
                repository_id=created_repos[0].id,
                pr_number=124,
                title="Fix responsive design issues",
                description="Resolves mobile layout problems on various screen sizes",
                author="jane_smith",
                status=models.ReviewStatus.processing,
                summary="Fixes several responsive design issues that were causing layout problems on mobile devices. Updates CSS media queries and flexbox layouts."
            ),
            models.PullRequestReview(
                repository_id=created_repos[1].id,
                pr_number=45,
                title="Optimize data preprocessing pipeline",
                description="Improves performance of data cleaning and feature extraction",
                author="data_scientist",
                status=models.ReviewStatus.done,
                summary="Optimizes the data preprocessing pipeline by implementing vectorized operations and caching mechanisms. Performance improvement of ~40%."
            ),
            models.PullRequestReview(
                repository_id=created_repos[1].id,
                pr_number=46,
                title="Add model validation tests",
                description="Implements comprehensive unit tests for ML models",
                author="test_engineer",
                status=models.ReviewStatus.pending,
                summary="Adds extensive unit tests for all ML model components including data validation, feature engineering, and model prediction accuracy tests."
            ),
            models.PullRequestReview(
                repository_id=created_repos[2].id,
                pr_number=78,
                title="Implement rate limiting middleware",
                description="Adds rate limiting to prevent API abuse",
                author="backend_dev",
                status=models.ReviewStatus.failed,
                summary="Implements Redis-based rate limiting middleware with configurable limits per endpoint. Includes sliding window algorithm for better user experience."
            )
        ]
        
        for review in reviews:
            db.add(review)
        
        db.commit()
        
        print("✅ Test data created successfully!")
        print(f"Created {len(repos)} repositories and {len(reviews)} reviews")
        
        # Print summary
        print("\nCreated repositories:")
        for repo in created_repos:
            print(f"  - {repo.name} (ID: {repo.id})")
        
        print("\nCreated reviews:")
        for review in db.query(models.PullRequestReview).all():
            print(f"  - PR #{review.pr_number}: {review.title} [{review.status}]")
            
    except Exception as e:
        print(f"❌ Error creating test data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create tables if they don't exist
    models.Base.metadata.create_all(bind=engine)
    
    # Add test data
    create_test_data()
