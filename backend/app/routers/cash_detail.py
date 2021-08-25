from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.cash_detail import CashDetailResponse
from ..schemas.cash_detail import CashDetailDelete, CashDetailCreate
from ..schemas.auth import User
from ..crud.cash_detail import get_cash_details, create_cash_detail
from ..crud.cash_detail import delete_cash_detail, update_cash_detail
from ..crud.cash_detail import get_cash_detail

router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])


#
# CAjaDetalle - CashDetail
#
@router.get("/api/cash-detail/", response_model=List[CashDetailResponse],
            tags=["CashDetail"])
def read_cash_details(skip: int=0, limit: int=100,
                      db: Session=Depends(get_db)):
    cash_detail=get_cash_details(db, skip=skip, limit=limit)
    return cash_detail


@router.post("/api/cash-detail/", response_model=CashDetailCreate,
             tags=["CashDetail"])
def create_cash_details(cash_detail: CashDetailCreate,
                        db: Session=Depends(get_db)):
    return create_cash_detail(db=db, cash_detail=cash_detail)


@router.patch("/api/cash-detail/",
              response_model=CashDetailResponse,
              tags=["CashDetail"])
def update_cash_details(cash_detail: CashDetailResponse,
                        db: Session=Depends(get_db)):
    db_cash_detail=update_cash_detail(db, cash_detail)
    if db_cash_detail is None:
        raise HTTPException(status_code=404, detail="Cash Detail not found")
    return db_cash_detail


@router.delete("/api/cash-detail/",
               response_model=CashDetailDelete,
               tags=["CashDetail"])
def delete_cash_details(cash_detail: CashDetailDelete,
                        db: Session=Depends(get_db)):
    db_cash_detail=delete_cash_detail(db, cash_detail)
    if db_cash_detail is None:
        raise HTTPException(status_code=404, detail="Cash Detail not found")
    return db_cash_detail


@router.get("/api/cash-detail/{cash_id}", response_model=List[CashDetailResponse],
            tags=["CashDetail"])
def get_a_cash_detail(cash_id: int, db: Session=Depends(get_db)):
    db_cash_detail=get_cash_detail(db, cash_id=cash_id)    
    if db_cash_detail is None:
        raise HTTPException(status_code=404, detail="Cash Detail not found")
    return db_cash_detail
