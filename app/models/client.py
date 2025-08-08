
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from pydantic import EmailStr

if TYPE_CHECKING:
    from app.models.invoice import Invoice
    from app.models.user import User


class Client(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None

    owner_id: int = Field(foreign_key="user.id")
    owner: "User" = Relationship(back_populates="clients")
    invoices: List["Invoice"] = Relationship(back_populates="client")


class ClientCreate(SQLModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None


class ClientRead(ClientCreate):
    id: int

    class Config:
        from_attributes = True