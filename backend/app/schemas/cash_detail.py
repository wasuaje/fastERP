from typing import List, Optional
import datetime
from pydantic import BaseModel


#
# CASH
#


class Cash(BaseModel):
    id: int


class CashDetailDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class CashDetailBase(BaseModel):
    concept: str
    amount: float
    cash_id: int


class CashDetailCreate(CashDetailBase):
    class Config:
        orm_mode = True
        schema_extra = {"concept": "Entrada XXXX",
                        "amount": 2515.12,
                        "cash_id": 22
                        }


class CashDetailResponse(CashDetailBase):
    id: int

    class Config:
        orm_mode = True
