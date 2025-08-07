import os
import hmac
import hashlib
from fastapi import APIRouter, Request, Header, HTTPException, Body
from pydantic import BaseModel
from dotenv import load_dotenv

from ..services.github   import fetch_diff, post_comment
from ..services.embedding import ingest_diff
from ..services.review    import make_summary

load_dotenv()
router = APIRouter()

GITHUB_SECRET = os.getenv("GITHUB_WEBHOOK_SECRET", "")

class PullRequestPayload(BaseModel):
    action: str
    pull_request: dict

def verify_signature(raw_body: bytes, signature: str):
    mac = hmac.new(GITHUB_SECRET.encode(), msg=raw_body, digestmod=hashlib.sha256)
    expected = f"sha256={mac.hexdigest()}"
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=401, detail="Invalid GitHub signature")

@router.post("/webhook")
async def github_webhook(
    request: Request,
    x_hub_signature_256: str = Header(...),
    payload: PullRequestPayload = Body(...)      # ← tell FastAPI to expect this JSON body
):
    # 1) Read raw body for signature check
    raw_body = await request.body()
    # verify_signature(raw_body, x_hub_signature_256)  # comment out or use SKIP flag in dev

    # 2) Use the already-parsed `payload`
    if payload.action in ("opened", "synchronize"):
        pr   = payload.pull_request
        pr_num = pr["number"]
        repo_full = pr["base"]["repo"]["full_name"]
        diff_url  = pr["diff_url"]

        diff_text = fetch_diff(diff_url)
        ingest_diff(pr_num, diff_text)
        summary = make_summary(pr_num)
        post_comment(pr_num, repo_full, summary)

        return {"status": "processed", "pr": pr_num}

    return {"status": "ignored"}
