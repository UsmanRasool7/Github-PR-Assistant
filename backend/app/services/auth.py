# app/services/auth.py
import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
import httpx
from ..db import schemas

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-jwt-key-here-change-in-production")
print(f"Auth service using SECRET_KEY: {SECRET_KEY}")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# GitHub OAuth Configuration
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, credentials_exception):
    print(f"🔐 verify_token called with token: {token[:20]}...")
    try:
        print(f"🔐 Decoding JWT with SECRET_KEY: {SECRET_KEY[:10]}...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"🔐 JWT decoded successfully: {payload}")
        username: str = payload.get("sub")
        if username is None:
            print(f"🔐 No 'sub' field in token payload")
            raise credentials_exception
        print(f"🔐 Extracted username: {username}")
        token_data = schemas.TokenData(username=username)
        print(f"🔐 Token verification successful")
        return token_data
    except JWTError as e:
        print(f"🔐 JWT Error: {str(e)}")
        raise credentials_exception
    except Exception as e:
        print(f"🔐 General error in verify_token: {str(e)}")
        raise credentials_exception

async def exchange_github_code_for_token(code: str) -> dict:
    """Exchange GitHub OAuth code for access token"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to exchange code for token"
            )
        
        return response.json()

async def get_github_user(access_token: str) -> dict:
    """Get GitHub user information"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"token {access_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user information from GitHub"
            )
        
        return response.json()

async def get_github_user_repos(access_token: str) -> list:
    """Get user's GitHub repositories"""
    async with httpx.AsyncClient() as client:
        repos = []
        page = 1
        per_page = 100
        
        while True:
            response = await client.get(
                f"https://api.github.com/user/repos?page={page}&per_page={per_page}&sort=updated",
                headers={
                    "Authorization": f"token {access_token}",
                    "Accept": "application/vnd.github.v3+json",
                },
            )
            
            if response.status_code != 200:
                break
                
            page_repos = response.json()
            if not page_repos:
                break
                
            repos.extend(page_repos)
            page += 1
            
            # Limit to avoid too many requests
            if len(repos) >= 500:
                break
        
        return repos

async def get_github_repo_prs(access_token: str, repo_full_name: str, state: str = "all") -> list:
    """Get pull requests for a specific repository"""
    async with httpx.AsyncClient() as client:
        prs = []
        page = 1
        per_page = 100
        
        while True:
            response = await client.get(
                f"https://api.github.com/repos/{repo_full_name}/pulls?state={state}&page={page}&per_page={per_page}&sort=updated",
                headers={
                    "Authorization": f"token {access_token}",
                    "Accept": "application/vnd.github.v3+json",
                },
            )
            
            if response.status_code != 200:
                break
                
            page_prs = response.json()
            if not page_prs:
                break
                
            prs.extend(page_prs)
            page += 1
            
            # Limit to avoid too many requests
            if len(prs) >= 200:
                break
        
        return prs
