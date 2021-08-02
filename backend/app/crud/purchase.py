from sqlalchemy.orm import Session
from ..models import Purchase as PurchaseModel, PurchaseDetail as PurchaseDetailModel
from ..schemas.purchase import PurchaseCreate, Purchase, PurchaseDelete


# CASH
def get_purchase(db: Session, purchase_id: int):
    return db.query(PurchaseModel).filter(PurchaseModel.id == purchase_id).first()


def get_purchasees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(PurchaseModel).offset(skip).limit(limit).all()


def create_purchase(db: Session, purchase: PurchaseCreate):
    db_purchase = PurchaseModel(date=purchase.date,
                                due_date=purchase.due_date,
                                invoice=purchase.invoice,
                                order=purchase.order,                                
                                employee_id=purchase.employee_id,                              
                                dct=purchase.dct,
                                tax=purchase.tax,                              
                                body_note=purchase.body_note,
                                foot_note=purchase.foot_note,
                                provider_id=purchase.provider_id
                                )

    db.add(db_purchase)
    db.commit()
    return db_purchase


def update_purchase(db: Session, purchase: PurchaseModel):
    purchase_data = db.query(PurchaseModel).filter(
        PurchaseModel.id == purchase.id).first()
    purchase_data.date = purchase.date
    purchase_data.due_date = purchase.due_date
    purchase_data.invoice = purchase.invoice
    purchase_data.order = purchase.order
    purchase_data.body_note = purchase.body_note
    purchase_data.foot_note = purchase.foot_note
    purchase_data.dct = purchase.dct
    purchase_data.tax = purchase.tax
    purchase_data.employee_id=purchase.employee_id    
    purchase_data.provider_id = purchase.provider_id
    db.commit()
    db.refresh(purchase_data)
    return purchase_data


def delete_purchase(db: Session, purchase: PurchaseDelete):
    purchase_data = db.query(PurchaseModel).filter(
        PurchaseModel.id == purchase.id).first()
    if purchase_data is None:
        return None
    else:
        db.delete(purchase_data)
        db.commit()
        return purchase_data
