from typing import List, Optional
import datetime
from pydantic import BaseModel
from .product import ProductQuickUpdate as ProductResponse

#
# CASH
#


class Invoice(BaseModel):
    id: int


class InvoiceDetailDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class InvoiceDetailBase(BaseModel):
    qtty: int
    price: float
    invoice_id: int
    product_id: int


class InvoiceDetailCreate(InvoiceDetailBase):
    class Config:
        orm_mode = True
        schema_extra = {"qtty": 2,
                        "price": 2515.12,
                        "invoice_id": 12,
                        "product_id": 9
                        }


class InvoiceDetail(Invoice, InvoiceDetailBase):

    class Config:
        orm_mode = True
        schema_extra = {"qtty": 2,
                        "price": 2515.12,
                        "invoice_id": 12,
                        "product_id": 9                        
                        }


class InvoiceDetailResponse(Invoice):
    qtty: int
    price: float
    invoice_id: int
    product: ProductResponse
    total: Optional[float] = 0.00

    class Config:
        orm_mode = True