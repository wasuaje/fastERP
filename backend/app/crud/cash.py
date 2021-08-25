from sqlalchemy.orm import Session
from fastapi import Depends
from ..models import Cash as CashModel, User
from ..schemas.cash import CashCreate, CashDelete, CashUpdate
from ..dependencies import get_current_user


# CASH
def get_cash(db: Session, cash_id: int):
    return db.query(CashModel).filter(CashModel.id == cash_id).first()


def get_cashes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CashModel).offset(skip).limit(limit).all()


def create_cash(db: Session, cash: CashCreate, current_user: User):    
    db_cash = CashModel(date=cash.date,
                        date_opened=cash.date_opened,
                        description=cash.description,
                        amount_open=cash.amount_open,                        
                        created_on=cash.created_on,
                        user_id=current_user.id,
                        status=cash.status)
    db.add(db_cash)
    db.commit()
    return db_cash


def update_cash(db: Session, cash: CashUpdate, current_user: User):
    cash_data = db.query(CashModel).filter(
        CashModel.id == cash.id).first()
    cash_data.date = cash.date    
    cash_data.description = cash.description
    cash_data.amount_open = cash.amount_open
    cash_data.user_id = current_user.id,        
    if cash.status == 1 or cash.status == 'True' or cash.status is True   :        #I've been ordered to close cash                        
        cash_data.date_closed = cash.date_closed
        cash_data.amount_close = cash.amount_close
        cash_data.status = 1

    db.commit()
    db.refresh(cash_data)
    return cash_data


def delete_cash(db: Session, cash: CashDelete):
    cash_data = db.query(CashModel).filter(
        CashModel.id == cash.id).first()
    if cash_data is None:
        return None
    else:
        db.delete(cash_data)
        db.commit()
        return cash_data
