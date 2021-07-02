from sqlalchemy.orm import Session
from ..models import Cash as CashModel
from ..schemas.cash import CashCreate, CashDelete


# CASH
def get_cash(db: Session, cash_id: int):
    return db.query(CashModel).filter(CashModel.id == cash_id).first()


def get_cashes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CashModel).offset(skip).limit(limit).all()


def create_cash(db: Session, cash: CashCreate):
    db_cash = CashModel(fecha=cash.fecha,
                        apertura=cash.apertura,
                        cierre=cash.apertura,
                        descripcion=cash.descripcion,
                        monto_apertura=cash.monto_apertura,
                        monto_cierre=cash.monto_cierre,
                        created_on=cash.created_on,
                        status=cash.status)
    db.add(db_cash)
    db.commit()
    return db_cash


def update_cash(db: Session, cash: CashModel):
    cash_data = db.query(CashModel).filter(
        CashModel.id == cash.id).first()
    cash_data.fecha = cash.fecha
    cash_data.apertura = cash.apertura
    cash_data.cierre = cash.cierre
    cash_data.descripcion = cash.descripcion
    cash_data.monto_apertura = cash.monto_apertura
    cash_data.monto_cierre = cash.monto_cierre
    cash_data.status = cash.status
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
