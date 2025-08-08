# user.py

from pydantic import BaseModel, EmailStr
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime, timezone

if TYPE_CHECKING:
    from app.models.client import Client
    from app.models.invoice import Invoice


class UserBase(SQLModel):
    email: EmailStr
    is_active: bool = True


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str
    email: EmailStr = Field(unique=True)
    is_active: bool = True
    is_admin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    clients: List["Client"] = Relationship(back_populates="owner")
    invoices: List["Invoice"] = Relationship(back_populates="owner")


class UserCreate(UserBase):
    username: str
    password: str


class UserRead(UserBase):
    id: int
    username: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = 'Bearer'

class TokenData(BaseModel):
    username: Optional[str] = None