from typing import List, Optional
import datetime
from pydantic import BaseModel
from .purchase_detail import PurchaseDetailResponse
from .provider import ProviderQuickUpdate as ProviderResponse
from .profesional import ProfesionalQuickUpdate as ProfesionalResponse

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
    due_date: datetime.date
    invoice: str
    order: Optional[str]
    body_note: Optional[str]
    foot_note: Optional[str]    
    dct: Optional[float]
    tax: Optional[float]
    employee_id: int
    provider_id: int
    created_on: Optional[datetime.datetime] = datetime.datetime.now()


class PurchaseCreate(PurchaseBase):
    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05T00:00:00",
                        "due_date": "2019-12-05T00:00:00",
                        "invoice": "FACT-001",
                        "order": "ORD-001",   
                        "dct": 5.00,
                        "tax": 12.00,
                        "body_note": "Long Detail level description or note",
                        "foot_note": "Long foot level description or note",                     
                        "employee_id": 25,
                        "provider_id": 12
                        }


class Purchase(PurchaseBase):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05T00:00:00",
                        "due_date": "2019-12-05T00:00:00",
                        "purchase": "FACT-001",
                        "order": "ORD-001",                        
                        "employee_id": 25,
                        "provider_id": 12
                        }


class PurchaseResponse(BaseModel):
    id: int
    date: datetime.date
    due_date: datetime.date
    invoice: str
    order: Optional[str]    
    subtotal: Optional[float]        
    dct: Optional[float]    
    tax: Optional[float]
    body_note: Optional[str]
    foot_note: Optional[str]
    payed: Optional[int]
    employee: ProfesionalResponse
    provider: ProviderResponse    
    created_on: datetime.datetime
    total: Optional[float] = 0.00
    purchase_detail: List[PurchaseDetailResponse]

    class Config:
        orm_mode = True
