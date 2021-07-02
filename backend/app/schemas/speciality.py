from typing import Optional
import datetime
from pydantic import BaseModel


#
# Speciality
#
class SpecialityBase(BaseModel):
    id: int


class SpecialityDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class SpecialityCreate(BaseModel):
    name: str
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "name": "My Speciality "
        }


class SpecialityQuickUpdate(SpecialityBase):
    name: str
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 999,
            "name": "My Speciality "
        }


# Suitable for update full speciality, and speciality get
class Speciality(SpecialityCreate):
    name: Optional[str]

    class Config:
        orm_mode = True
        schema_extra = {
            "name": "Nails"
        }


class SpecialityResponse(Speciality, SpecialityCreate):
    id: int

    class Config:
        schema_extra = {
            "name": "My Speciality",
                    "created_on": "2020-12-12"
        }
