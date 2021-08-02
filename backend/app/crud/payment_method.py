from sqlalchemy.orm import Session
from ..models import PaymentMethod as PaymentMethodModel
from ..schemas.payment_method import PaymentMethod as PaymentMethodSchema, PaymentMethodQuickCreate
from ..schemas.payment_method import PaymentMethodQuickUpdate, PaymentMethodDelete


def get_payment_methods(db: Session, skip: int = 0, limit: int = 100):
    return db.query(PaymentMethodModel).offset(skip).limit(limit).all()


def get_payment_method(db: Session, payment_method_id: int):
    return db.query(PaymentMethodModel).filter(
        PaymentMethodModel.id == payment_method_id).first()


def create_payment_method(db: Session, payment_method: PaymentMethodSchema):
    db_payment_method = PaymentMethodModel(name=payment_method.name,                              
                              )
    db.add(db_payment_method)
    db.commit()
    return db_payment_method


def update_payment_method(db: Session, payment_method: PaymentMethodQuickUpdate):
    payment_method_data = db.query(PaymentMethodModel).filter(
        PaymentMethodModel.id == payment_method.id).first()
    payment_method_data.name = payment_method.name    

    db.commit()
    db.refresh(payment_method_data)
    return payment_method_data


def delete_payment_method(db: Session, payment_method: PaymentMethodDelete):
    payment_method_data = db.query(PaymentMethodModel).filter(
        PaymentMethodModel.id == payment_method.id).first()
    if payment_method_data is None:
        return None
    else:
        db.delete(payment_method_data)
        db.commit()
        return payment_method_data
