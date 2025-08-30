# app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from ..db import crud, schemas, models
from ..db.database import get_db
from ..services.auth import (
    create_access_token, 
    verify_token, 
    exchange_github_code_for_token,
    get_github_user,
    get_github_user_repos,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from datetime import timedelta

router = APIRouter(prefix="/api/auth", tags=["authentication"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        if not credentials or not credentials.credentials:
            raise credentials_exception
            
        token = credentials.credentials
        token_data = verify_token(token, credentials_exception)
        user = crud.get_user_by_username(db, username=token_data.username)
        
        if user is None:
            raise credentials_exception
            
        return user
        
    except HTTPException as he:
        raise he
    except Exception as e:
        import traceback
        raise credentials_exception

@router.get("/test-auth")
def test_auth_endpoint(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Test endpoint to debug authentication"""
    if credentials:
        return {"message": "Token received", "token_preview": credentials.credentials[:20] + "..."}
    else:
        return {"message": "No credentials received"}

@router.get("/github/callback", response_model=schemas.Token)
async def github_callback(code: str, db: Session = Depends(get_db)):
    """Handle GitHub OAuth callback"""
    try:
        # Exchange code for GitHub access token
        github_token_data = await exchange_github_code_for_token(code)
        github_access_token = github_token_data.get("access_token")
        
        if not github_access_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get access token from GitHub"
            )
        
        # Get user information from GitHub
        github_user = await get_github_user(github_access_token)
        
        # Check if user exists in our database
        user = crud.get_user_by_github_id(db, github_id=github_user["id"])
        
        if not user:
            # Create new user
            user_create = schemas.UserCreate(
                github_id=github_user["id"],
                username=github_user["login"],
                email=github_user.get("email"),
                full_name=github_user.get("name"),
                avatar_url=github_user.get("avatar_url"),
                github_access_token=github_access_token
            )
            user = crud.create_user(db, user_create)
        else:
            # Update existing user
            user_update = schemas.UserUpdate(
                email=github_user.get("email"),
                full_name=github_user.get("name"),
                avatar_url=github_user.get("avatar_url"),
                github_access_token=github_access_token
            )
            user = crud.update_user(db, user, user_update)
        
        # Create JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        token_response = schemas.Token(
            access_token=access_token,
            token_type="bearer",
            user=schemas.UserOut.model_validate(user)
        )
        return token_response
        
    except Exception as e:
        import traceback
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Authentication failed: {str(e)}"
        )

@router.get("/me", response_model=schemas.UserOut)
def get_current_user_profile(current_user: models.User = Depends(get_current_user)):
    """Get current authenticated user profile"""
    return current_user

@router.post("/sync-repos")
async def sync_user_repositories(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Sync user's GitHub repositories to our database"""
    try:
        if not current_user.github_access_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="GitHub access token not available"
            )
        
        # Get repositories from GitHub
        github_repos = await get_github_user_repos(current_user.github_access_token)
        
        synced_repos = []
        for github_repo in github_repos:
            # Check if repository already exists
            existing_repo = crud.get_repository_by_github_id(db, github_id=github_repo["id"])
            
            if not existing_repo:
                # Create new repository
                repo_create = schemas.RepositoryCreate(
                    github_id=github_repo["id"],
                    full_name=github_repo["full_name"],
                    name=github_repo["name"],
                    description=github_repo.get("description"),
                    default_branch=github_repo.get("default_branch", "main"),
                    is_private=github_repo.get("private", False)
                )
                repo = crud.create_repository_for_user(db, repo_create, current_user.id)
                synced_repos.append(repo)
            else:
                # Update existing repository
                synced_repos.append(existing_repo)
        
        return {
            "message": f"Successfully synced {len(synced_repos)} repositories",
            "repositories": [repo.full_name for repo in synced_repos]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sync repositories: {str(e)}"
        )

@router.get("/repositories")
def get_user_repositories(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user's repositories"""
    try:
        repositories = crud.list_user_repositories(db, user_id=current_user.id)
        return repositories
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get repositories: {str(e)}"
        )

@router.get("/reviews")
def get_user_reviews(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user's reviews"""
    try:
        reviews = crud.list_user_reviews(db, user_id=current_user.id)
        return reviews
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get reviews: {str(e)}"
        )

@router.get("/dashboard", response_model=schemas.DashboardStats)
def get_user_dashboard_stats(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user's dashboard statistics"""
    try:
        stats = crud.get_user_dashboard_stats(db, user_id=current_user.id)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get dashboard stats: {str(e)}"
        )
