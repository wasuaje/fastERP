from typing import List, Optional
import datetime
from pydantic import BaseModel
from .product import ProductQuickUpdate as ProductResponse


#
# Inventory
#


class Inventory(BaseModel):
    id: int


class InventoryDetailDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class InventoryDetailBase(BaseModel):
    qtty: int
    product_id: int
    inventory_id: int


class InventoryDetailCreate(InventoryDetailBase):
    class Config:
        orm_mode = True
        schema_extra = {"qtty": 2,
                        "product_id": 5,
                        "inventory_id": 22
                        }


class InventoryDetailUpdate(Inventory):
    qtty: int
    product_id: int
    inventory_id: int
    class Config:
        orm_mode = True
        schema_extra = {"id": 2,
                        "qtty": 2,
                        "product_id": 5,
                        "inventory_id": 22
                        }


class InventoryDetailResponse(Inventory):    
    qtty: int    
    inventory_id: int
    product: ProductResponse
    class Config:
        orm_mode = True
