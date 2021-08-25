from sqlalchemy.orm import Session
from ..models import CashDetail as CashDetailModel
from ..schemas.cash_detail import CashDetailResponse,CashDetailCreate, CashDetailDelete


def get_cash_details(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CashDetailModel).offset(skip).limit(limit).all()


def get_cash_detail(db: Session, cash_id: int):
    return db.query(CashDetailModel).filter(
        CashDetailModel.cash_id == cash_id).all()


def create_cash_detail(db: Session, cash_detail: CashDetailCreate):
    db_cash_detail = CashDetailModel(concept=cash_detail.concept,
                                     amount=cash_detail.amount,
                                     cash_id=cash_detail.cash_id)
    db.add(db_cash_detail)
    db.commit()
    return db_cash_detail


def update_cash_detail(db: Session, cash_detail: CashDetailResponse):
    cash_detail_data = db.query(CashDetailModel).filter(
        CashDetailModel.id == cash_detail.id).first()
    cash_detail_data.concept = cash_detail.concepto
    cash_detail_data.amount = cash_detail.amount
    db.add(cash_detail_data)
    db.commit()
    return cash_detail_data


def delete_cash_detail(db: Session, cash_detail: CashDetailDelete):
    cash_detail_data = db.query(CashDetailModel).filter(
        CashDetailModel.id == cash_detail.id).first()
    if cash_detail_data is None:
        return None
    else:
        db.delete(cash_detail_data)
        db.commit()
        return cash_detail_data
