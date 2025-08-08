from datetime import timedelta, datetime, timezone
from typing import Optional , Annotated

from fastapi.security import (OAuth2PasswordBearer ,
                              OAuth2PasswordRequestForm)
from fastapi import Depends , HTTPException , status
from pydantic import BaseModel, EmailStr
import jwt
from jwt import InvalidTokenError
from app.utils.security import verify_password , hash_password
from sqlmodel import Session , select
from app.models.user import User
from app.core.config import settings
from app.core.database import get_session

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_user(db: Session, username: str):
    user = db.exec(select(User).where(User.username == username)).first()
    if not user:
        return None
    return user

def authenticate_user(db: Session ,username: str, password: str):
    user = get_user(db, username)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user

def create_access_token(data: dict , expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode,settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str , Depends(oauth2_scheme)], db :  Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(db, username= username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user))->User:
    if current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def register_user_service(db: Session, username: str, email: str , password: str)->User:
    statement = select(User).where((User.username == username) | (User.email == email))
    user = db.exec(statement).first()
    if user:
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = hash_password(password)
    new_user = User(username=username , email=email , password=hashed_password,is_active=True , is_admin=True)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user





