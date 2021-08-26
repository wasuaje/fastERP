from sqlalchemy.orm import Session
from ..models import InventoryDetail as InventoryDetailModel
from ..schemas.inventory_detail import InventoryDetailResponse,InventoryDetailCreate, InventoryDetailDelete
from .utils import update_inventory

def get_inventory_details(db: Session, skip: int = 0, limit: int = 100):
    return db.query(InventoryDetailModel).offset(skip).limit(limit).all()


def get_inventory_detail(db: Session, inventory_id: int):
    return db.query(InventoryDetailModel).filter(
        InventoryDetailModel.inventory_id == inventory_id).all()


def create_inventory_detail(db: Session, inventory_detail: InventoryDetailCreate):
    db_inventory_detail = InventoryDetailModel(qtty=inventory_detail.qtty,
                                     product_id=inventory_detail.product_id,
                                     inventory_id=inventory_detail.inventory_id)
    db.add(db_inventory_detail)
    db.commit()
    sign = '-' if db_inventory_detail.qtty < 0 else '+'
    update_inventory(db, db_inventory_detail.product_id,abs(db_inventory_detail.qtty), sign)
    return db_inventory_detail


def update_inventory_detail(db: Session, inventory_detail: InventoryDetailResponse):
    inventory_detail_data = db.query(InventoryDetailModel).filter(
        InventoryDetailModel.id == inventory_detail.id).first()
    inventory_detail_data.qtty = inventory_detail.qtty
    inventory_detail_data.product_id = inventory_detail.product_id
    db.add(inventory_detail_data)
    db.commit()
    return inventory_detail_data


def delete_inventory_detail(db: Session, inventory_detail: InventoryDetailDelete):
    inventory_detail_data = db.query(InventoryDetailModel).filter(
        InventoryDetailModel.id == inventory_detail.id).first()
    if inventory_detail_data is None:
        return None
    else:
        db.delete(inventory_detail_data)
        db.commit()
        sign = '+' if inventory_detail_data.qtty < 0 else '-'
        update_inventory(db, inventory_detail_data.product_id,abs(inventory_detail_data.qtty), sign)
        return inventory_detail_data
