# app/router/invoice.py

from typing import List , Optional
from fastapi import APIRouter, Depends, status, Response
from sqlmodel import Session

# Import the user model for authentication dependency
from app.models.user import User
# Import the main table model and the read schema
from app.models.invoice import Invoice
from app.models.invoice import   InvoiceCreate, InvoiceUpdate

# Import services and dependencies
from app.services import invoice_service
from app.services.auth_service import get_current_active_user
from app.core.database import get_session
from app.models.invoice import InvoiceStatus
from app.utils.pdf_generator import generate_invoice_pdf_bytes

router = APIRouter(prefix="/invoices", tags=["invoices"])

@router.get("/", response_model=List[Invoice])
def get_all_invoices(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
    status: Optional[InvoiceStatus] = None,
    client_id: Optional[int] = None
):
    return invoice_service.get_invoices_for_user(owner=current_user, db=db , status=status, client_id=client_id)

@router.get("/{invoice_id}", response_model=Invoice)
def get_single_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session)
):
    return invoice_service.get_invoice_by_id(invoice_id=invoice_id, owner=current_user, db=db)

@router.post("/", response_model=Invoice, status_code=status.HTTP_201_CREATED)
def create_new_invoice(
    invoice_data: InvoiceCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session)
):
    return invoice_service.create_invoice(invoice_data=invoice_data, owner=current_user, db=db)

@router.put("/{invoice_id}", response_model=Invoice)
def update_existing_invoice(
    invoice_id: int,
    invoice_data: InvoiceUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session)
):
    return invoice_service.update_invoice(
        invoice_id=invoice_id, invoice_update=invoice_data, owner=current_user, db=db
    )

@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_an_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session)
):
    invoice_service.delete_invoice(invoice_id=invoice_id, owner=current_user, db=db)
    return None


@router.get("/{invoice_id}/download")
def download_invoice_as_pdf(
        invoice_id: int,
        current_user: User = Depends(get_current_active_user),
        db: Session = Depends(get_session)
):

    invoice = invoice_service.get_invoice_by_id(
        invoice_id=invoice_id, owner=current_user, db=db
    )

    pdf_bytes = generate_invoice_pdf_bytes(invoice)

    filename = f"invoice_{invoice.invoice_number}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
