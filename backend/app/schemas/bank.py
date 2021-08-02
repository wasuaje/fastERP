from typing import List, Optional
import datetime
from pydantic import BaseModel


#
# Bank
#
class BankBase(BaseModel):
    id: int


class BankDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class BankQuickCreate(BaseModel):
    name: str
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "HSBC Bank"
            }
        }


class BankQuickUpdate(BankBase):
    name: str    
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 999,
                "name": "HSBC Bank "             
            }
        }


# Suitable for update full productCategory, and productCategory get
class Bank(BankQuickCreate):    

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "HSBC Bank"
            }
        }


class BankResponse(Bank, BankQuickCreate):
    id: int

    class Config:
        schema_extra = {
            "example": {
                "name": "HSBC Bank"
                       }
        }
