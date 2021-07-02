from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db
from ..schemas.purchase import Purchase, PurchaseCreate, PurchaseDelete, PurchaseResponse
from ..schemas.auth import User
from ..crud.purchase import get_purchasees, create_purchase
from ..crud.purchase import get_purchase, delete_purchase, update_purchase

router = APIRouter()

#
# Caja - CASH
#
@router.get("/api/purchase/", response_model=List[PurchaseResponse], tags=["Purchase"])
def list_purchase(skip: int = 0, limit: int = 100,
                  db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_active_user)):
    purchase = get_purchasees(db, skip=skip, limit=limit)
    return purchase


@router.post("/api/purchase/", response_model=Purchase, tags=["Purchase"])
def create_a_purchase(purchase: PurchaseCreate,
                      db: Session = Depends(get_db),
                      current_user: User = Depends(get_current_active_user)):
    return create_purchase(db=db, purchase=purchase)


@router.get("/api/purchase/{purchase_id}", response_model=PurchaseResponse,
            tags=["Purchase"])
def get_a_purchase(purchase_id: int, db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_active_user)):
    db_purchase = get_purchase(db, purchase_id=purchase_id)
    if db_purchase is None:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return db_purchase


@router.patch("/api/purchase", response_model=Purchase,
              tags=["Purchase"])
def update_purchases(purchase: Purchase,
                     db: Session = Depends(get_db),
                     current_user: User = Depends(
                         get_current_active_user)):
    db_client = update_purchase(db, purchase)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return db_client


@router.delete("/api/purchase/",
               response_model=PurchaseDelete,
               tags=["Purchase"])
def delete_a_purchase(purchase: PurchaseDelete,
                      db: Session = Depends(get_db),
                      current_user: User = Depends(
                          get_current_active_user)):
    db_purchase = delete_purchase(db, purchase)
    if db_purchase is None:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return db_purchase
