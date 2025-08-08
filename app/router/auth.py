from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException , status
from sqlmodel import Session

from app.services.auth_service import register_user_service , get_current_active_user , Token , create_access_token , authenticate_user
from app.core.database import get_session
from app.models.user import User , UserCreate
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register" , response_model=Token)
async def register_user(form_data: UserCreate ,db: Session = Depends(get_session)) :
    user = register_user_service(db=db, username=form_data.username, email=form_data.email , password=form_data.password)
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/login" , response_model=Token)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends() , db : Session = Depends(get_session)):
    user = authenticate_user(db , form_data.username , form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")