from typing import List, Optional
import datetime
from pydantic import BaseModel


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
    fecha: datetime.datetime
    apertura: Optional[datetime.datetime] = datetime.datetime.now()
    cierre: Optional[datetime.datetime] = datetime.datetime.now()
    monto_apertura: Optional[float] = 0.00
    monto_cierre: Optional[float] = 0.00
    descripcion: Optional[str] = "Descripcion: "
    status: Optional[str] = 0
    created_on: Optional[datetime.datetime] = datetime.datetime.now()


class CashCreate(CashBase):
    class Config:
        orm_mode = True
        schema_extra = {"fecha": "2019-12-05T00:00:00",
                        "apertura": "2019-12-05T00:00:00",
                        "cierre": None,
                        "monto_apertura": 2515,
                        "monto_cierre": 0,
                        "descripcion": "Apertura"

                        }


class Cash(CashBase):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {"fecha": "2019-12-05T00:00:00",
                        "apertura": "2019-12-05T00:00:00",
                        "cierre": None,
                        "monto_apertura": 2515,
                        "monto_cierre": 0,
                        "descripcion": "Apertura"
                        }
