from typing import List, Optional
import datetime
from pydantic import BaseModel
from .product import ProductQuickUpdate as ProductResponse

#
# CASH
#


class ClientDocument(BaseModel):
    id: int


class ClientDocumentDetailDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class ClientDocumentDetailBase(BaseModel):
    qtty: int
    price: float
    client_document_id: int
    product_id: int


class ClientDocumentDetailCreate(ClientDocumentDetailBase):
    class Config:
        orm_mode = True
        schema_extra = {"qtty": 2,
                        "price": 2515.12,
                        "client_document_id": 12,
                        "product_id": 9
                        }


class ClientDocumentDetail(ClientDocument, ClientDocumentDetailBase):

    class Config:
        orm_mode = True
        schema_extra = {"qtty": 2,
                        "price": 2515.12,
                        "client_document_id": 12,
                        "product_id": 9                        
                        }


class ClientDocumentDetailResponse(ClientDocument):
    qtty: int
    price: float
    client_document_id: int
    product: ProductResponse
    total: Optional[float] = 0.00

    class Config:
        orm_mode = True