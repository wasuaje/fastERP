from sqlalchemy.orm import Session
from ..models import CashDetail as CashDetailModel
from ..schemas.cash_detail import CashDetail as CashDetailSchema, CashDetailDelete


def get_cash_details(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CashDetailModel).offset(skip).limit(limit).all()


def get_cash_detail(db: Session, cash_detail_id: int):
    return db.query(CashDetailModel).filter(
        CashDetailModel.id == cash_detail_id).first()


def create_cash_detail(db: Session, cash_detail: CashDetailSchema):
    db_cash_detail = CashDetailModel(concepto=cash_detail.concepto,
                                     monto=cash_detail.monto,
                                     caja_id=cash_detail.caja_id)
    db.add(db_cash_detail)
    db.commit()
    return db_cash_detail


def update_cash_detail(db: Session, cash_detail: CashDetailSchema):
    cash_detail_data = db.query(CashDetailModel).filter(
        CashDetailModel.id == cash_detail.id).first()
    cash_detail_data.concepto = cash_detail.concepto
    cash_detail_data.monto = cash_detail.monto
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
