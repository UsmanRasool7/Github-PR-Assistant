from dotenv import load_dotenv
load_dotenv()
#PR-Test
from fastapi import FastAPI
from .routes.webhook import router as webhook_router


app = FastAPI()
app.include_router(webhook_router)
