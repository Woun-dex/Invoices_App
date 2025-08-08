# invoice.py

from datetime import date, datetime, timezone
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING
from enum import Enum

if TYPE_CHECKING:
    from app.models.client import Client
    from app.models.user import User

class InvoiceStatus(str, Enum):
    PENDING = "Pending"
    PAID = "Paid"
    OVERDUE = "Overdue"


class Invoice(SQLModel, table=True):
    id: int = Field(primary_key=True)
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