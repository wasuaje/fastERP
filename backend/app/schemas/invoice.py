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
    date: datetime.datetime
    invoice: str
    order: Optional[str]
    payment_nro: Optional[str]
    payment_method: Optional[str]
    profesional_id: int
    contact_id: int
    created_on: Optional[datetime.datetime] = datetime.datetime.now()


class InvoiceCreate(InvoiceBase):
    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05T00:00:00",
                        "invoice": "FACT-001",
                        "order": "ORD-001",
                        "payment_nro": "PYM-001",
                        "payment_method": "Efectivo",
                        "profesional_id": 25,
                        "contact_id": 12
                        }


class Invoice(InvoiceBase):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05T00:00:00",
                        "invoice": "FACT-001",
                        "order": "ORD-001",
                        "payment_nro": "PYM-001",
                        "payment_method": "Efectivo",
                        "profesional_id": 25,
                        "contact_id": 12
                        }


class InvoiceResponse(BaseModel):
    id: int
    date: datetime.datetime
    invoice: str
    order: Optional[str]
    payment_nro: Optional[str]
    payment_method: Optional[str]
    profesional: ProfesionalResponse
    client: ClientResponse
    created_on: datetime.datetime
    invoice_detail: List[InvoiceDetailResponse]

    class Config:
        orm_mode = True
