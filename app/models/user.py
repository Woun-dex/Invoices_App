from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
import datetime

from app.models.client import Client
from app.models.invoice import Invoice


class UserBase(SQLModel):
    email: str
    is_active: bool


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    hashed_password: str
    email: str
    is_active: bool
    is_admin: bool
    created_at: datetime = Field(default_factory=datetime.datetime.now)
    clients : List["Client"] = Relationship(back_populates="owner")
    invoices : List["Invoice"] = Relationship(back_populates="owner")


class UserCreate(UserBase):
    password: str

class UserUpdate(SQLModel):
    email: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

class UserRead(UserBase):
    id: int
    created_at: datetime

class Token(SQLModel):
    access_token: str
    token_type: str = 'Bearer'

class TokenData(SQLModel):
    email: Optional[str] = None
