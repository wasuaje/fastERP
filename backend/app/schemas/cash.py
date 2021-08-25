from typing import List, Optional
import datetime
from pydantic import BaseModel
from .auth import User
from .cash_detail import CashDetailResponse

#
# CASH
#


class CashDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class CashBase(BaseModel):
    date: datetime.date
    date_opened: Optional[datetime.datetime] = datetime.datetime.now()
    date_closed: Optional[datetime.datetime] = datetime.datetime.now()
    amount_open: Optional[float] = 0.00
    amount_close: Optional[float] = 0.00
    description: Optional[str] = "Descripcion: "
    status: Optional[str] = 0
    user: Optional[User]    
    created_on: Optional[datetime.datetime] = datetime.datetime.now()


class CashCreate(CashBase):
    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05",
                        "date_opened": "2019-12-05T00:00:00",
                        "date_closed": None,
                        "amount_open": 2515,
                        "amount_close": 0,
                        "description": "Apertura"

                        }

class CashUpdate(CashBase):
    id: int
    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05",
                        "date_opened": "2019-12-05T00:00:00",
                        "date_closed": None,
                        "amount_open": 2515,
                        "amount_close": 0,
                        "description": "Apertura"

                        }

class CashResponse(CashBase):
    id: int
    cash_detail: List[Optional[CashDetailResponse]]
    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05T00:00:00",
                        "date_opened": "2019-12-05T00:00:00",
                        "date_closed": None,
                        "amount_open": 2515,
                        "amount_close": 0,
                        "description": "Apertura"
                        }
