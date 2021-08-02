from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.invoice import Invoice, InvoiceCreate, InvoiceDelete, InvoiceResponse
from ..schemas.auth import User
from ..crud.invoice import get_invoicees, create_invoice
from ..crud.invoice import get_invoice, delete_invoice, update_invoice
# from fastapi_pagination import paginate, Page


router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Facturacion - Invoice
#
@router.get("/api/invoice/", response_model=List[InvoiceResponse], tags=["Invoice"])
def list_invoice(skip: int = 0, limit: int = 100,
                 db: Session = Depends(get_db)):
    invoice = get_invoicees(db, skip=skip, limit=limit)
    return invoice
    # return paginate(invoice)



@router.post("/api/invoice/", response_model=Invoice, tags=["Invoice"])
def create_a_invoice(invoice: InvoiceCreate,
                     db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_active_user)):
    return create_invoice(db=db, invoice=invoice)


@router.get("/api/invoice/{invoice_id}", response_model=InvoiceResponse,
            tags=["Invoice"])
def get_a_invoice(invoice_id: int, db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_active_user)):
    db_invoice = get_invoice(db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice


@router.patch("/api/invoice", response_model=Invoice,
              tags=["Invoice"])
def update_invoices(invoice: Invoice,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(
                        get_current_active_user)):
    db_client = update_invoice(db, invoice)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_client


@router.delete("/api/invoice/",
               response_model=InvoiceDelete,
               tags=["Invoice"])
def delete_a_invoice(invoice: InvoiceDelete,
                     db: Session = Depends(get_db),
                     current_user: User = Depends(
                         get_current_active_user)):
    db_invoice = delete_invoice(db, invoice)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice
