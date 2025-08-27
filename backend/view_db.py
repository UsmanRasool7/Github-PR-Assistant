#!/usr/bin/env python3
"""
Simple script to view database contents
"""
import sqlite3
import pandas as pd

# Connect to database
conn = sqlite3.connect('pr_assistant.db')

print("=== REPOSITORIES ===")
repos = pd.read_sql_query("SELECT * FROM repositories", conn)
print(repos)

print("\n=== PULL REQUEST REVIEWS ===")
reviews = pd.read_sql_query("SELECT * FROM pull_request_reviews", conn)
print(reviews)

print("\n=== TABLE SCHEMAS ===")
tables = pd.read_sql_query("SELECT name FROM sqlite_master WHERE type='table'", conn)
print("Tables:", tables['name'].tolist())

conn.close()
