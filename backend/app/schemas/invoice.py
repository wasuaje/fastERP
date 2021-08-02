from sqlalchemy import func
from typing import List, Optional
import datetime
from pydantic import BaseModel
from .invoice_detail import InvoiceDetailResponse
from .client import ClientQuickUpdate as ClientResponse
from .profesional import ProfesionalQuickUpdate as ProfesionalResponse

#
# CASH
#


class InvoiceDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class InvoiceBase(BaseModel):
    date: datetime.date
    due_date: datetime.date
    invoice: str
    order: Optional[str]
    body_note: Optional[str]
    foot_note: Optional[str]    
    dct: Optional[float]
    tax: Optional[float]
    employee_id: int
    client_id: int
    created_on: Optional[datetime.datetime] = datetime.datetime.now()


class InvoiceCreate(InvoiceBase):
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
                        "client_id": 12
                        }


class Invoice(InvoiceBase):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05T00:00:00",
                        "due_date": "2019-12-05T00:00:00",  
                        "invoice": "FACT-001",
                        "order": "ORD-001",                        
                        "employee_id": 25,
                        "client_id": 12
                        }


class InvoiceResponse(BaseModel):
    id: int
    date: datetime.date
    due_date: Optional[datetime.date]
    invoice: str
    order: Optional[str]
    subtotal: Optional[float]        
    dct: Optional[float]    
    tax: Optional[float]
    body_note: Optional[str]
    foot_note: Optional[str]
    collected: Optional[int]    
    employee: ProfesionalResponse
    client: ClientResponse    
    created_on: datetime.datetime
    total: Optional[float] = 0.00
    invoice_detail: List[InvoiceDetailResponse]

    class Config:
        orm_mode = True
