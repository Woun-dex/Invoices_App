from typing import List, Optional

from sqlalchemy import func
from sqlmodel import select, Session, or_
from fastapi import HTTPException, status
from datetime import datetime, date  # ✅ FIX: Import 'datetime' class directly

from app.models.Dashboard import DashboardStats
from app.models.invoice import Invoice, InvoiceStatus
from app.models.user import User
from app.models.invoice import InvoiceCreate, InvoiceUpdate
from app.services.client_service import get_client_by_id


def get_invoices_for_user(
        owner: User,
        db: Session,
        status: Optional[InvoiceStatus] = None,
        client_id: Optional[int] = None
) -> List[Invoice]:
    """Retrieves all invoices for a user, with optional filters and auto-updates overdue status."""

    # Auto-update logic for overdue invoices
    overdue_invoices_stmt = select(Invoice).where(
        Invoice.owner_id == owner.id,
        Invoice.status == InvoiceStatus.PENDING,
        Invoice.due_at < date.today()
    )
    overdue_invoices = db.exec(overdue_invoices_stmt).all()
    if overdue_invoices:
        for invoice in overdue_invoices:
            invoice.status = InvoiceStatus.OVERDUE
            db.add(invoice)
        db.commit()

    # Dynamic query building for fetching invoices
    statement = select(Invoice).where(Invoice.owner_id == owner.id)
    if status:
        statement = statement.where(Invoice.status == status)
    if client_id:
        statement = statement.where(Invoice.client_id == client_id)

    statement = statement.order_by(Invoice.created_at.desc())
    invoices = db.exec(statement).all()
    return invoices


def get_invoice_by_id(invoice_id: int, owner: User, db: Session) -> Invoice:
    """Retrieves a single invoice by ID, ensuring it belongs to the owner."""
    statement = select(Invoice).where(Invoice.id == invoice_id, Invoice.owner_id == owner.id)
    invoice = db.exec(statement).first()
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return invoice


def create_invoice(invoice_data: InvoiceCreate, owner: User, db: Session) -> Invoice:
    """Creates a new invoice with an auto-generated invoice number."""
    get_client_by_id(client_id=invoice_data.client_id, owner_id=owner.id, db=db)

    # Auto-generate the unique invoice number
    invoice_count_stmt = select(func.count(Invoice.id)).where(Invoice.owner_id == owner.id)
    invoice_count = db.exec(invoice_count_stmt).one()

    today_str = datetime.now().strftime('%Y%m%d')  # ✅ FIX: This now works correctly
    new_invoice_number = f"{today_str}-{owner.id}-{invoice_count + 1}"

    new_invoice = Invoice.model_validate(invoice_data, update={
        "owner_id": owner.id,
        "invoice_number": new_invoice_number
    })

    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)
    return new_invoice


def update_invoice(invoice_id: int, invoice_update: InvoiceUpdate, owner: User, db: Session) -> Invoice:
    """Updates an invoice's information."""
    db_invoice = get_invoice_by_id(invoice_id=invoice_id, owner=owner, db=db)
    update_data = invoice_update.model_dump(exclude_unset=True)

    if "client_id" in update_data:
        get_client_by_id(client_id=update_data["client_id"], owner_id=owner.id, db=db)

    for key, value in update_data.items():
        setattr(db_invoice, key, value)

    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice


def delete_invoice(invoice_id: int, owner: User, db: Session):
    """Deletes an invoice."""
    invoice_to_delete = get_invoice_by_id(invoice_id=invoice_id, owner=owner, db=db)
    db.delete(invoice_to_delete)
    db.commit()
    return

def get_dashboard_stats(owner: User, db: Session) -> DashboardStats:

    # 2. Create aggregation queries
    total_revenue_query = select(func.sum(Invoice.amount)).where(
        Invoice.owner_id == owner.id,
        Invoice.status == InvoiceStatus.PAID
    )

    pending_amount_query = select(func.sum(Invoice.amount)).where(
        Invoice.owner_id == owner.id,
        Invoice.status == InvoiceStatus.PENDING
    )

    overdue_amount_query = select(func.sum(Invoice.amount)).where(
        Invoice.owner_id == owner.id,
        Invoice.status == InvoiceStatus.OVERDUE
    )

    total_invoices_query = select(func.count(Invoice.id)).where(
        Invoice.owner_id == owner.id
    )

    # 3. Execute the queries and handle None if no results are found
    total_revenue = db.exec(total_revenue_query).first() or 0.0
    pending_amount = db.exec(pending_amount_query).first() or 0.0
    overdue_amount = db.exec(overdue_amount_query).first() or 0.0
    total_invoices = db.exec(total_invoices_query).first() or 0

    # 4. Return the data in the shape of our schema
    return DashboardStats(
        total_revenue=total_revenue,
        pending_amount=pending_amount,
        overdue_amount=overdue_amount,
        total_invoices=total_invoices
    )