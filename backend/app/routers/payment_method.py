from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.payment_method import PaymentMethod as PaymentMethodSchema, PaymentMethodQuickCreate
from ..schemas.payment_method import PaymentMethodQuickUpdate, PaymentMethodResponse
from ..schemas.payment_method import PaymentMethodDelete
from ..schemas.auth import User
from ..crud.payment_method import get_payment_methods, create_payment_method
from ..crud.payment_method import update_payment_method, get_payment_method
from ..crud.payment_method import delete_payment_method

router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Pay mentMethod
#
@router.get("/api/payment-method/", response_model=List[PaymentMethodResponse],
            tags=["Payment-Method"])
def read_product_categories(skip: int = 0, limit: int = 100,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(
                                get_current_active_user)):
    cash = get_payment_methods(db, skip=skip, limit=limit)
    return cash


@router.post("/api/payment-method/", response_model=PaymentMethodResponse,
             tags=["Payment-Method"])
def create_product_categories(payment_method: PaymentMethodSchema,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    return create_payment_method(db=db, payment_method=payment_method)


@router.patch("/api/payment-method/",
              response_model=PaymentMethodResponse,
              tags=["Payment-Method"])
def update_product_categories(payment_method: PaymentMethodQuickUpdate,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    db_product = update_payment_method(db, payment_method)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Payment Method not found")
    return db_product


@router.delete("/api/payment-method/",
               response_model=PaymentMethodDelete,
               tags=["Payment-Method"])
def delete_product_categories(payment_method: PaymentMethodDelete,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    db_product = delete_payment_method(db, payment_method)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Payment Method not found")
    return db_product


@router.get("/api/payment-method/{payment_method_id}", response_model=PaymentMethodResponse, tags=["Payment-Method"])
def get_a_payment_method(payment_method_id: int, db: Session = Depends(get_db),
                           current_user: User = Depends(get_current_active_user)):
    db_product = get_payment_method(db, payment_method_id=payment_method_id)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Payment Method not found")
    return db_product

