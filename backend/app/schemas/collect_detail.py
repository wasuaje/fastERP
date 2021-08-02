from typing import List, Optional
import datetime
from pydantic import BaseModel
from .bank import BankResponse
from .payment_method import PaymentMethodResponse

#
# CASH
#


class Collect(BaseModel):
    id: int


class CollectDetailDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class CollectDetailBase(BaseModel):
    amount: int
    reference: str
    bank_id: Optional[int]
    payment_method_id: int
    collect_id: int
    


class CollectDetailCreate(CollectDetailBase):
    class Config:
        orm_mode = True
        schema_extra = {"amount": 223.22,
                        "reference": "paying my bills",                        
                        "bank_id": 9,
                        "payment_method_id": 9,
                        "collect_id": 12,
                        }


class CollectDetail(Collect, CollectDetailBase):

    class Config:
        orm_mode = True
        schema_extra = {"amount": 223.22,
                        "reference": "paying my bills",                        
                        "bank_id": 9,
                        "payment_method_id": 9,
                        "collect_id": 12,                      
                        }


class CollectDetailResponse(Collect):
    amount: int
    reference: str
    collect_id: int    
    payment_method: PaymentMethodResponse    
    bank: Optional[BankResponse]

    class Config:
        orm_mode = True