from sqlalchemy.orm import Session
from ..models import PurchaseDetail as PurchaseDetailModel
from ..schemas.purchase_detail import PurchaseDetail as PurchaseDetailSchema, PurchaseDetailDelete


def get_purchase_details(db: Session, skip: int = 0, limit: int = 100):
    return db.query(PurchaseDetailModel).offset(skip).limit(limit).all()


def get_purchase_detail(db: Session, purchase_detail_id: int):
    return db.query(PurchaseDetailModel).filter(
        PurchaseDetailModel.id == purchase_detail_id).first()


# TODO: Decrease stock by invoice.detail.qtty in product
def create_purchase_detail(db: Session, purchase_detail: PurchaseDetailSchema):
    db_purchase_detail = PurchaseDetailModel(qtty=purchase_detail.qtty,
                                             price=purchase_detail.price,
                                             purchase_id=purchase_detail.purchase_id,
                                             product_id=purchase_detail.product_id
                                             )
    db.add(db_purchase_detail)
    db.commit()
    return db_purchase_detail


def update_purchase_detail(db: Session, purchase_detail: PurchaseDetailSchema):
    purchase_detail_data = db.query(PurchaseDetailModel).filter(
        PurchaseDetailModel.id == purchase_detail.id).first()
    purchase_detail_data.qtty = purchase_detail.qtty
    purchase_detail_data.price = purchase_detail.price
    purchase_detail_data.purchase_id = purchase_detail.purchase_id
    purchase_detail_data.product_id = purchase_detail.product_id    
    db.commit()
    db.refresh(purchase_detail_data)
    return purchase_detail_data


# TODO: Increase stock by invoice.detail.qtty in product
def delete_purchase_detail(db: Session, purchase_detail: PurchaseDetailDelete):
    purchase_detail_data = db.query(PurchaseDetailModel).filter(
        PurchaseDetailModel.id == purchase_detail.id).first()
    if purchase_detail_data is None:
        return None
    else:
        db.delete(purchase_detail_data)
        db.commit()
        return purchase_detail_data
