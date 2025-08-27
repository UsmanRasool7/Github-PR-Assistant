#!/usr/bin/env python3
"""
Debug script to check database connection and data
"""
import os
import sys
sys.path.append('.')

from app.db.database import engine, SessionLocal
from app.db.models import Repository
from sqlalchemy import text

def check_database():
    print("=== DATABASE DEBUG INFO ===")
    
    # Check connection string
    print(f"Database URL: {engine.url}")
    
    # Test connection
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Connected to: {version}")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return
    
    # Check tables exist
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            tables = [row[0] for row in result]
            print(f"📋 Tables found: {tables}")
    except Exception as e:
        print(f"❌ Error checking tables: {e}")
    
    # Check data in repositories table
    db = SessionLocal()
    try:
        repos = db.query(Repository).all()
        print(f"📊 Repositories count: {len(repos)}")
        for repo in repos:
            print(f"  - ID: {repo.id}, Name: {repo.full_name}, Created: {repo.created_at}")
    except Exception as e:
        print(f"❌ Error querying repositories: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_database()
