from sqlalchemy.orm import Session
from ..models import Bank as BankModel
from ..schemas.bank import Bank as BankSchema, BankQuickCreate
from ..schemas.bank import BankQuickUpdate, BankDelete


def get_banks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(BankModel).offset(skip).limit(limit).all()


def get_bank(db: Session, bank_id: int):
    return db.query(BankModel).filter(
        BankModel.id == bank_id).first()


def create_bank(db: Session, bank: BankSchema):
    db_bank = BankModel(name=bank.name,                              
                              )
    db.add(db_bank)
    db.commit()
    return db_bank


def update_bank(db: Session, bank: BankQuickUpdate):
    bank_data = db.query(BankModel).filter(
        BankModel.id == bank.id).first()
    bank_data.name = bank.name    

    db.commit()
    db.refresh(bank_data)
    return bank_data


def delete_bank(db: Session, bank: BankDelete):
    bank_data = db.query(BankModel).filter(
        BankModel.id == bank.id).first()
    if bank_data is None:
        return None
    else:
        db.delete(bank_data)
        db.commit()
        return bank_data
