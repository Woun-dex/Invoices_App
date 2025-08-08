from fastapi import Depends, FastAPI
from app.utils.security import get_token_header
from app.router import auth

app = FastAPI()

app.include_router(auth.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}