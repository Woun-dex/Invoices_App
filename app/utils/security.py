from passlib.context import CryptContext
from typing import Annotated
from fastapi import Header ,  HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def get_token_header(x_token : Annotated[str , Header()]):
    if x_token is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

