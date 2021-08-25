from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.invoice_detail import InvoiceDetail, InvoiceDetailResponse
from ..schemas.invoice_detail import InvoiceDetailDelete, InvoiceDetailCreate
from ..schemas.auth import User
from ..crud.invoice_detail import get_invoice_details, create_invoice_detail
from ..crud.invoice_detail import delete_invoice_detail, update_invoice_detail
from ..crud.invoice_detail import get_invoice_detail


router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# FacturaDetalle - InvoiceDetail
#
@router.get("/api/invoice-detail/", response_model=List[InvoiceDetailResponse],
            tags=["InvoiceDetail"])
def read_invoice_details(skip: int = 0, limit: int = 100,
                         db: Session = Depends(get_db),
                         current_user: User = Depends(
                             get_current_active_user)):
    invoice_detail = get_invoice_details(db, skip=skip, limit=limit)
    return invoice_detail

@router.post("/api/invoice-detail/", response_model=InvoiceDetailCreate,
             tags=["InvoiceDetail"])
def create_invoice_details(invoice_detail: InvoiceDetailCreate,
                           db: Session = Depends(get_db),
                           current_user: User = Depends(
                               get_current_active_user)):
    return create_invoice_detail(db=db, invoice_detail=invoice_detail)

# not sure if worht thinking about stock
@router.patch("/api/invoice-detail/",
              response_model=InvoiceDetail,
              tags=["InvoiceDetail"])
def update_invoice_details(invoice_detail: InvoiceDetail,
                           db: Session = Depends(get_db),
                           current_user: User = Depends(
                               get_current_active_user)):
    db_invoice_detail = update_invoice_detail(db, invoice_detail)
    if db_invoice_detail is None:
        raise HTTPException(status_code=404, detail="InvoiceDetail not found")
    return db_invoice_detail

@router.delete("/api/invoice-detail/",
               response_model=InvoiceDetailDelete,
               tags=["InvoiceDetail"])
def delete_invoice_details(invoice_detail: InvoiceDetailDelete,
                           db: Session = Depends(get_db),
                           current_user: User = Depends(
                               get_current_active_user)):
    db_invoice_detail = delete_invoice_detail(db, invoice_detail)
    if db_invoice_detail is None:
        raise HTTPException(status_code=404, detail="InvoiceDetail not found")
    return db_invoice_detail


@router.get("/api/invoice-detail/{invoice_id}", response_model=List[InvoiceDetailResponse], tags=["InvoiceDetail"])
def get_a_invoice_detail(invoice_id: int, db: Session = Depends(get_db),
                         current_user: User = Depends(get_current_active_user)):
    db_invoice_detail = get_invoice_detail(
        db, invoice_id=invoice_id)
    if db_invoice_detail is None:
        raise HTTPException(status_code=404, detail="InvoiceDetail not found")
    return db_invoice_detail
