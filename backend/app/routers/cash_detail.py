from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db
from ..schemas.cash_detail import CashDetail
from ..schemas.cash_detail import CashDetailDelete, CashDetailCreate
from ..schemas.auth import User
from ..crud.cash_detail import get_cash_details, create_cash_detail
from ..crud.cash_detail import delete_cash_detail, update_cash_detail
from ..crud.cash_detail import get_cash_detail

router = APIRouter()

#
# CAjaDetalle - CashDetail
#
@router.get("/api/cash-detail/", response_model=List[CashDetail],
            tags=["CashDetail"])
def read_cash_details(skip: int = 0, limit: int = 100,
                      db: Session = Depends(get_db),
                      current_user: User = Depends(
                          get_current_active_user)):
    cash_detail = get_cash_details(db, skip=skip, limit=limit)
    return cash_detail


@router.post("/api/cash-detail/", response_model=CashDetailCreate,
             tags=["CashDetail"])
def create_cash_details(cash_detail: CashDetailCreate,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(
                            get_current_active_user)):
    return create_cash_detail(db=db, cash_detail=cash_detail)


@router.patch("/api/cash-detail/",
              response_model=CashDetail,
              tags=["CashDetail"])
def update_cash_details(cash_detail: CashDetail,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(
                            get_current_active_user)):
    db_cash_detail = update_cash_detail(db, cash_detail)
    if db_cash_detail is None:
        raise HTTPException(status_code=404, detail="CashDetail not found")
    return db_cash_detail


@router.delete("/api/cash-detail/",
               response_model=CashDetailDelete,
               tags=["CashDetail"])
def delete_cash_details(cash_detail: CashDetailDelete,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(
                            get_current_active_user)):
    db_cash_detail = delete_cash_detail(db, cash_detail)
    if db_cash_detail is None:
        raise HTTPException(status_code=404, detail="CashDetail not found")
    return db_cash_detail


@router.get("/api/cash-detail/{cash_detail_id}", response_model=CashDetail,
            tags=["CashDetail"])
def get_a_cash_detail(cash_detail_id: int, db: Session = Depends(get_db),
                      current_user: User = Depends(get_current_active_user)):
    db_cash_detail = get_cash_detail(db, cash_detail_id=cash_detail_id)
    if db_cash_detail is None:
        raise HTTPException(status_code=404, detail="CashDetail not found")
    return db_cash_detail
