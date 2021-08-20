from typing import List, Optional
import datetime
from pydantic import BaseModel


#
# DocumentType
#
class DocumentTypeBase(BaseModel):
    id: int


class DocumentTypeDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class DocumentTypeQuickCreate(BaseModel):
    code: str
    name: str
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "code": "ND",
                "name": "My Product Category "
            }
        }


class DocumentTypeQuickUpdate(DocumentTypeBase):
    code: str
    name: str    
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 999,
                "code": "ND",
                "name": "My DocumentType "             
            }
        }


# Suitable for update full productCategory, and productCategory get
class DocumentType(DocumentTypeQuickCreate):    

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "code": "ND",
                "name": "My DocumentType"
            }
        }


class DocumentTypeResponse(DocumentType, DocumentTypeQuickCreate):
    id: int

    class Config:
        schema_extra = {
            "example": {
                "code": "ND",
                "name": "My DocumentType"
                       }
        }
