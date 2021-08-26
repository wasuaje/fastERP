from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.inventory_detail import InventoryDetailResponse, InventoryDetailUpdate
from ..schemas.inventory_detail import InventoryDetailDelete, InventoryDetailCreate
from ..schemas.auth import User
from ..crud.inventory_detail import get_inventory_details, create_inventory_detail
from ..crud.inventory_detail import delete_inventory_detail, update_inventory_detail
from ..crud.inventory_detail import get_inventory_detail

router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])


#
# CAjaDetalle - InventoryDetail
#
@router.get("/api/inventory-detail/", response_model=List[InventoryDetailResponse],
            tags=["InventoryDetail"])
def read_inventory_details(skip: int=0, limit: int=100,
                      db: Session=Depends(get_db)):
    inventory_detail=get_inventory_details(db, skip=skip, limit=limit)
    return inventory_detail


@router.post("/api/inventory-detail/", response_model=InventoryDetailCreate,
             tags=["InventoryDetail"])
def create_inventory_details(inventory_detail: InventoryDetailCreate,
                        db: Session=Depends(get_db)):
    return create_inventory_detail(db=db, inventory_detail=inventory_detail)


@router.patch("/api/inventory-detail/",
              response_model=InventoryDetailResponse,
              tags=["InventoryDetail"])
def update_inventory_details(inventory_detail: InventoryDetailUpdate,
                        db: Session=Depends(get_db)):
    db_inventory_detail=update_inventory_detail(db, inventory_detail)
    if db_inventory_detail is None:
        raise HTTPException(status_code=404, detail="Inventory Detail not found")
    return db_inventory_detail


@router.delete("/api/inventory-detail/",
               response_model=InventoryDetailDelete,
               tags=["InventoryDetail"])
def delete_inventory_details(inventory_detail: InventoryDetailDelete,
                        db: Session=Depends(get_db)):
    db_inventory_detail=delete_inventory_detail(db, inventory_detail)
    if db_inventory_detail is None:
        raise HTTPException(status_code=404, detail="Inventory Detail not found")
    return db_inventory_detail


@router.get("/api/inventory-detail/{inventory_id}", response_model=List[InventoryDetailResponse],
            tags=["InventoryDetail"])
def get_a_inventory_detail(inventory_id: int, db: Session=Depends(get_db)):
    db_inventory_detail=get_inventory_detail(db, inventory_id=inventory_id)    
    if db_inventory_detail is None:
        raise HTTPException(status_code=404, detail="Inventory Detail not found")
    return db_inventory_detail
