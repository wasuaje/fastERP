from sqlalchemy.orm import Session
from ..models import PurchaseDetail as PurchaseDetailModel, Purchase, Product
from ..schemas.purchase_detail import PurchaseDetail as PurchaseDetailSchema, PurchaseDetailDelete
from .utils import update_inventory_and_cost, update_purchase

def get_purchase_details(db: Session, skip: int = 0, limit: int = 100):
    return db.query(PurchaseDetailModel).offset(skip).limit(limit).all()


def get_purchase_detail(db: Session, purchase_id: int):    
    return db.query(PurchaseDetailModel).filter(
        PurchaseDetailModel.purchase_id == purchase_id).all()

# TODO: Decrease stock by invoice.detail.qtty in product
def create_purchase_detail(db: Session, purchase_detail: PurchaseDetailSchema):
    db_purchase_detail = PurchaseDetailModel(qtty=purchase_detail.qtty,
                                             price=purchase_detail.price,
                                             purchase_id=purchase_detail.purchase_id,
                                             product_id=purchase_detail.product_id
                                             )
    db.add(db_purchase_detail)
    db.commit()
    update_purchase(db, purchase_detail.purchase_id)
    update_inventory_and_cost(db, db_purchase_detail.product_id, db_purchase_detail.qtty,db_purchase_detail.price,'+')
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
        update_purchase(db, purchase_detail_data.purchase_id)
        update_inventory_and_cost(db, purchase_detail_data.product_id, purchase_detail_data.qtty,purchase_detail_data.price,'-')
        return purchase_detail_data
