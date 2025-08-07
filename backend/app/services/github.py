# app/services/github.py
from dotenv import load_dotenv
load_dotenv()

import os, requests

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS_DIFF = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3.diff",
}
HEADERS_COMMENT = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json",
}

def fetch_diff(diff_url: str) -> str:
    resp = requests.get(diff_url, headers=HEADERS_DIFF)
    resp.raise_for_status()
    return resp.text

def post_comment(pr_number: int, repo_full: str, body: str):
    url = f"https://api.github.com/repos/{repo_full}/issues/{pr_number}/comments"
    resp = requests.post(url, json={"body": body}, headers=HEADERS_COMMENT)
    resp.raise_for_status()
    return resp.json()
