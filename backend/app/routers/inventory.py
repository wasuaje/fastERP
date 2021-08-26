from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.inventory import InventoryResponse, InventoryCreate, InventoryDelete, InventoryUpdate
from ..schemas.auth import User
from ..schemas.product import ProductResponse
from ..crud.inventory import get_inventoryes, create_inventory, get_inventory, delete_inventory
from ..crud.inventory import update_inventory
from ..crud.product import get_products_with_existence


router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Inventario - Inventory
#
@router.get("/api/inventory/", response_model=List[InventoryResponse], tags=["Inventory"])
def list_inventory(skip: int = 0, limit: int = 100,
              db: Session = Depends(get_db)):
    inventory = get_inventoryes(db, skip=skip, limit=limit)
    return inventory


@router.post("/api/inventory/", response_model=InventoryResponse, tags=["Inventory"])
def create_a_inventory(inventory: InventoryCreate,
                  db: Session = Depends(get_db), 
                  current_user: User = Depends(get_current_active_user)):
    return create_inventory(db=db, inventory=inventory, current_user=current_user)



@router.get("/api/inventory/report-valorized", 
            response_model=List[ProductResponse], 
            tags=["Inventory"])
def get_valorized_inventory(skip: int = 0, limit: int = 100,
              db: Session = Depends(get_db)):
    inventory = get_products_with_existence(db, skip=skip, limit=limit)
    return inventory


@router.get("/api/inventory/{inventory_id}", response_model=InventoryResponse, tags=["Inventory"])
def get_a_inventory(inventory_id: int, db: Session = Depends(get_db)):
    db_inventory = get_inventory(db, inventory_id=inventory_id)
    if db_inventory is None:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return db_inventory


@router.patch("/api/inventory", response_model=InventoryResponse,
              tags=["Inventory"])
def update_inventoryes(inventory: InventoryUpdate,
                  db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_active_user)):
    db_client = update_inventory(db, inventory, current_user)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return db_client


@router.delete("/api/inventory/",
               response_model=InventoryDelete,
               tags=["Inventory"])
def delete_a_inventory(inventory: InventoryDelete,
                  db: Session = Depends(get_db)):
    db_inventory = delete_inventory(db, inventory)
    if db_inventory is None:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return db_inventory


