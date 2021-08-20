from sqlalchemy import func
from typing import List, Optional
import datetime

from sqlalchemy.sql.sqltypes import Boolean
from pydantic import BaseModel
from .client_document_detail import ClientDocumentDetailResponse
from .client import ClientResponse
from .profesional import ProfesionalQuickUpdate as ProfesionalResponse
from .document_type import DocumentTypeResponse
#
# CASH
#


class ClientDocumentDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class ClientDocumentBase(BaseModel):
    document_type_id: int
    date: datetime.date
    due_date: datetime.date
    document: Optional[str]
    dct: Optional[float]
    tax: Optional[float]
    body_note: Optional[str]
    foot_note: Optional[str]
    affect_inventory: int
    employee_id: int
    client_id: int
    created_on: Optional[datetime.datetime] = datetime.datetime.now()


class ClientDocumentCreate(ClientDocumentBase):
    class Config:
        orm_mode = True
        schema_extra = {"document_type_id": 2,
                        "date": "2019-12-05T00:00:00",
                        "due_date": "2019-12-05T00:00:00",
                        "document": "ND-001",
                        "dct": 5.00,
                        "tax": 12.00,
                        "body_note": "Long Detail level description or note",
                        "foot_note": "Long foot level description or note",
                        "employee_id": 25,
                        "client_id": 12
                        }


class ClientDocument(ClientDocumentBase):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {"document_type_id": 2,
                        "date": "2019-12-05T00:00:00",
                        "due_date": "2019-12-05T00:00:00",
                        "document": "ND-001",
                        "dct": 5.00,
                        "tax": 12.00,
                        "body_note": "Long Detail level description or note",
                        "foot_note": "Long foot level description or note",
                        "employee_id": 25,
                        "client_id": 12
                        }


class ClientDocumentResponse(BaseModel):
    id: int
    document_type: DocumentTypeResponse
    date: datetime.date
    due_date: Optional[datetime.date]
    document: str
    subtotal: float
    dct: Optional[float]
    tax: Optional[float]
    body_note: Optional[str]
    foot_note: Optional[str]
    collected: Optional[int]
    employee: ProfesionalResponse
    affect_inventory: int
    client: ClientResponse
    created_on: datetime.datetime
    total: float
    client_document_detail: List[ClientDocumentDetailResponse]

    class Config:
        orm_mode = True
