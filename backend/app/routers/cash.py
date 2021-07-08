from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.cash import Cash, CashCreate, CashDelete
from ..schemas.auth import User
from ..crud.cash import get_cashes, create_cash, get_cash, delete_cash
from ..crud.cash import update_cash

router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Caja - CASH
#
@router.get("/api/cash/", response_model=List[Cash], tags=["Cash"])
def list_cash(skip: int = 0, limit: int = 100,
              db: Session = Depends(get_db),
              current_user: User = Depends(get_current_active_user)):
    cash = get_cashes(db, skip=skip, limit=limit)
    return cash


@router.post("/api/cash/", response_model=Cash, tags=["Cash"])
def create_a_cash(cash: CashCreate,
                  db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_active_user)):
    return create_cash(db=db, cash=cash)


@router.get("/api/cash/{cash_id}", response_model=Cash, tags=["Cash"])
def get_a_cash(cash_id: int, db: Session = Depends(get_db),
               current_user: User = Depends(get_current_active_user)):
    db_cash = get_cash(db, cash_id=cash_id)
    if db_cash is None:
        raise HTTPException(status_code=404, detail="Cash not found")
    return db_cash


@router.patch("/api/cash", response_model=Cash,
              tags=["Cash"])
def update_cashes(cash: Cash,
                  db: Session = Depends(get_db),
                  current_user: User = Depends(
                      get_current_active_user)):
    db_client = update_cash(db, cash)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Cash not found")
    return db_client


@router.delete("/api/cash/",
               response_model=CashDelete,
               tags=["Cash"])
def delete_a_cash(cash: CashDelete,
                  db: Session = Depends(get_db),
                  current_user: User = Depends(
                      get_current_active_user)):
    db_cash = delete_cash(db, cash)
    if db_cash is None:
        raise HTTPException(status_code=404, detail="Cash not found")
    return db_cash
