from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.bank import Bank as BankSchema, BankQuickCreate
from ..schemas.bank import BankQuickUpdate, BankResponse
from ..schemas.bank import BankDelete
from ..schemas.auth import User
from ..crud.bank import get_banks, create_bank
from ..crud.bank import update_bank, get_bank
from ..crud.bank import delete_bank

router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Bank
#
@router.get("/api/bank/", response_model=List[BankResponse],
            tags=["Bank"])
def read_bank(skip: int = 0, limit: int = 100,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(
                                get_current_active_user)):
    cash = get_banks(db, skip=skip, limit=limit)
    return cash


@router.post("/api/bank/", response_model=BankResponse,
             tags=["Bank"])
def create_bank(bank: BankSchema,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    return create_bank(db=db, bank=bank)


@router.patch("/api/bank/",
              response_model=BankResponse,
              tags=["Bank"])
def update_bank(bank: BankQuickUpdate,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    db_product = update_bank(db, bank)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Bank not found")
    return db_product


@router.delete("/api/bank/",
               response_model=BankDelete,
               tags=["Bank"])
def delete_bank(bank: BankDelete,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    db_product = delete_bank(db, bank)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Bank not found")
    return db_product


@router.get("/api/bank/{bank_id}", response_model=BankResponse, tags=["Bank"])
def get_a_bank(bank_id: int, db: Session = Depends(get_db),
                           current_user: User = Depends(get_current_active_user)):
    db_product = get_bank(db, bank_id=bank_id)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Bank not found")
    return db_product

