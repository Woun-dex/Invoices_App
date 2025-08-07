import datetime

from sqlmodel import SQLModel, Field, Relationship

from app.models.client import Client
from app.models.user import User


class Invoice(SQLModel, table=True):
    id : int = Field(primary_key=True)
    invoice_number: str = Field(nullable=False , unique=True)
    amount : float
    status : str = "Pending"
    issued_at: datetime.date
    due_at: datetime.date
    created_at: datetime = Field(default_factory=datetime.datetime.now)
    client_id: int = Field(foreign_key="client.id")
    owner_id: int = Field(foreign_key="user.id")
    client: Client = Relationship(back_populates="invoices")
    owner: User = Relationship(back_populates="invoices")