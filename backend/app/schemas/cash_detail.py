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
    concepto: str
    monto: float
    caja_id: int


class CashDetailCreate(CashDetailBase):
    class Config:
        orm_mode = True
        schema_extra = {"concepto": "Entrada XXXX",
                        "monto": 2515.12,
                        "cash": 22
                        }


class CashDetail(CashDetailBase):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {"concepto": "Entrada XXXX",
                        "monto": 2515.12,
                        "cash": 22
                        }
