from typing import List, Optional
import datetime
from pydantic import BaseModel


#
# PaymentMethod
#
class PaymentMethodBase(BaseModel):
    id: int


class PaymentMethodDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class PaymentMethodQuickCreate(BaseModel):
    name: str
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "My Payment Method "
            }
        }


class PaymentMethodQuickUpdate(PaymentMethodBase):
    name: str    
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 999,
                "name": "My PaymentMethod "             
            }
        }


# Suitable for update full productCategory, and productCategory get
class PaymentMethod(PaymentMethodQuickCreate):    

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "My PaymentMethod"
            }
        }


class PaymentMethodResponse(PaymentMethod, PaymentMethodQuickCreate):
    id: int

    class Config:
        schema_extra = {
            "example": {
                "name": "My PaymentMethod"
                       }
        }
