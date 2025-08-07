from sqlmodel import SQLModel, Field, Relationship

from typing import Optional, List

from app.models.invoice import Invoice
from app.models.user import UserCreate, User


class Client(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    owner_id: int = Field(foreign_key="user.id")
    owner: User = Relationship(back_populates="clients")
    invoice: List["Invoice"] = Relationship(back_populates="client")



class ClientCreate(SQLModel):
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None

class ClientUpdate(SQLModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class ClientRead(SQLModel):
    id : int
    name : str
    email : str
    phone : Optional[str] = None
    address : Optional[str] = None


    class Config:
        orm_mode = True
