from typing import List, Optional
import datetime
from pydantic import BaseModel
from .profesional import ProfesionalQuickUpdate as ProfesionalResponse
from .product import ProductQuickUpdate as ProductResponse

#
# CASH
#


class Purchase(BaseModel):
    id: int


class PurchaseDetailDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class PurchaseDetailBase(BaseModel):
    qtty: int
    price: float
    purchase_id: int
    product_id: int    


class PurchaseDetailCreate(PurchaseDetailBase):
    class Config:
        orm_mode = True
        schema_extra = {"qtty": 2,
                        "price": 2515.12,
                        "purchase_id": 12,
                        "product_id": 9                   
                        }


class PurchaseDetail(Purchase, PurchaseDetailBase):

    class Config:
        orm_mode = True
        schema_extra = {"qtty": 2,
                        "price": 2515.12,
                        "purchase_id": 12,
                        "product_id": 9                        
                        }


class PurchaseDetailResponse(Purchase):
    qtty: int
    price: float
    purchase_id: int
    product: ProductResponse    

    class Config:
        orm_mode = True
        