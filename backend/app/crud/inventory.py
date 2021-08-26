from sqlalchemy.orm import Session
from fastapi import Depends
from ..models import Inventory as InventoryModel, User
from ..schemas.inventory import InventoryCreate, InventoryDelete, InventoryUpdate
from ..dependencies import get_current_user


# CASH
def get_inventory(db: Session, inventory_id: int):
    return db.query(InventoryModel).filter(InventoryModel.id == inventory_id).first()


def get_inventoryes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(InventoryModel).offset(skip).limit(limit).all()


def create_inventory(db: Session, inventory: InventoryCreate, current_user: User):    
    db_inventory = InventoryModel(date=inventory.date,                        
                        description=inventory.description,                        
                        created_on=inventory.created_on,
                        user_id=current_user.id,
                        status=inventory.status)
    db.add(db_inventory)
    db.commit()
    return db_inventory


def update_inventory(db: Session, inventory: InventoryUpdate, current_user: User):
    inventory_data = db.query(InventoryModel).filter(
        InventoryModel.id == inventory.id).first()
    inventory_data.date = inventory.date    
    inventory_data.description = inventory.description    
    inventory_data.user_id = current_user.id,            
    inventory_data.status = inventory.status

    db.commit()
    db.refresh(inventory_data)
    return inventory_data


def delete_inventory(db: Session, inventory: InventoryDelete):
    inventory_data = db.query(InventoryModel).filter(
        InventoryModel.id == inventory.id).first()
    if inventory_data is None:
        return None
    else:
        db.delete(inventory_data)
        db.commit()
        return inventory_data
