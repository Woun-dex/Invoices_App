# invoice.py

from datetime import date, datetime, timezone
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING , Optional
from enum import Enum

if TYPE_CHECKING:
    from app.models.client import Client
    from app.models.user import User

class InvoiceStatus(str, Enum):
    PENDING = "Pending"
    PAID = "Paid"
    OVERDUE = "Overdue"


class Invoice(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    invoice_number: str = Field(unique=True, index=True)
    amount: float
    status: InvoiceStatus = Field(default=InvoiceStatus.PENDING)
    issued_at: date
    due_at: date
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    client_id: int = Field(foreign_key="client.id")
    owner_id: int = Field(foreign_key="user.id")

    client: "Client" = Relationship(back_populates="invoices")
    owner: "User" = Relationship(back_populates="invoices")


class InvoiceCreate(SQLModel):
        amount: float
        status: InvoiceStatus = InvoiceStatus.PENDING
        issued_at: date
        due_at: date
        client_id: int

class InvoiceUpdate(SQLModel):
    amount: Optional[float] = None
    status: Optional[InvoiceStatus] = None
    issued_at: Optional[date] = None
    due_at: Optional[date] = None
    client_id: Optional[int] = None
