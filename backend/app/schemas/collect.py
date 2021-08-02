from sqlalchemy import func
from typing import List, Optional
import datetime
from pydantic import BaseModel
from .collect_detail import CollectDetailResponse
from .client import ClientQuickUpdate as ClientResponse
from .invoice import InvoiceResponse
from .profesional import ProfesionalQuickUpdate as ProfesionalResponse

#
# CASH
#


class CollectDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class CollectBase(BaseModel):
    date: datetime.date
    description: str
    invoice_id: int
    created_on: Optional[datetime.datetime] = datetime.datetime.now()


class CollectCreate(CollectBase):
    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05T00:00:00",                        
                        "description": "This is a invoice collection msg",
                        "invoice_id": 9999
                        
                        }


class Collect(CollectBase):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05T00:00:00",                        
                        "description": "This is a invoice collection msg",
                        "invoice_id": 9999
                        }


class CollectResponse(BaseModel):
    id: int
    date: datetime.date
    description: str
    invoice: InvoiceResponse    
    created_on: datetime.datetime
    total: Optional[float] = 0.00
    collect_detail: List[CollectDetailResponse]

    class Config:
        orm_mode = True
