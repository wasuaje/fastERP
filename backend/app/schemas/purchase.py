from typing import List, Optional
import datetime
from pydantic import BaseModel
from .purchase_detail import PurchaseDetailResponse
from .provider import ProviderQuickUpdate as ProviderResponse

#
# CASH
#


class PurchaseDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class PurchaseBase(BaseModel):
    date: datetime.date
    invoice: str
    order: Optional[str]
    payment_nro: Optional[str]
    payment_method: Optional[str]
    provider_id: int
    created_on: Optional[datetime.datetime] = datetime.datetime.now()


class PurchaseCreate(PurchaseBase):
    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05T00:00:00",
                        "purchase": "FACT-001",
                        "order": "ORD-001",
                        "payment_nro": "PYM-001",
                        "payment_method": "Efectivo",
                        "provider_id": 12
                        }


class Purchase(PurchaseBase):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05T00:00:00",
                        "purchase": "FACT-001",
                        "order": "ORD-001",
                        "payment_nro": "PYM-001",
                        "payment_method": "Efectivo",
                        "provider_id": 12
                        }


class PurchaseResponse(BaseModel):
    id: int
    date: datetime.date
    invoice: str
    order: Optional[str]
    payment_nro: Optional[str]
    payment_method: Optional[str]
    provider: ProviderResponse
    created_on: datetime.datetime
    purchase_detail: List[PurchaseDetailResponse]

    class Config:
        orm_mode = True
