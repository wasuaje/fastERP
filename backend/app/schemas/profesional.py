from typing import List, Optional
import datetime
from pydantic import BaseModel


#
# Profesional
#
class ProfesionalBase(BaseModel):
    id: int


class ProfesionalDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class ProfesionalQuickCreate(BaseModel):
    name: str
    phone: str
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "John Doe",
                "phone": "+54 91132234345"
            }
        }


class ProfesionalQuickUpdate(ProfesionalBase):
    name: str
    phone: str
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 999,
                "name": "John Doe",
                "phone": "+54 91132234345"
            }
        }


# Suitable for update full profesional, and profesional get
class Profesional(ProfesionalQuickCreate):
    email: str
    gender: str

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "John Doe",
                "phone": "+54 91132234345",
                "email": "myemail@myserver.com",
                "gender": "F"
            }
        }


class ProfesionalResponse(Profesional, ProfesionalQuickCreate):
    id: int

    class Config:
        schema_extra = {
            "example": {
                "name": "John Doe",
                "phone": "+54 91132234345",
                "email": "myemail@myserver.com",
                "gender": "F"
            }
        }
