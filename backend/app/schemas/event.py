from typing import List, Optional
import datetime
from pydantic import BaseModel
from .profesional import ProfesionalQuickUpdate as ProfesionalResponse
from .client import ClientQuickUpdate as ClientResponse
from .speciality import SpecialityResponse


#
# Event
#
class EventBase(BaseModel):
    id: int


class EventDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class EventCreate(BaseModel):
    start: datetime.datetime
    end: datetime.datetime
    profesional_id: int
    contact_id: int
    speciality_id: int

    class Config:
        schema_extra = {            
                "start": "2021-03-03T22:28:26.986Z",
                "end": "2021-03-03T22:28:26.986Z",
                "profesional_id": 99,
                "contact_id": 12,
                "speciality_id": 23

        }


class EventUpdate(EventCreate):
    id: int

    class Config:
        schema_extra = {     
                "id": 12,
                "start": "2021-03-03T22:28:26.986Z",
                "end": "2021-03-03T22:28:26.986Z",
                "profesional_id": 99,
                "contact_id": 12,
                "speciality_id": 23

        }


# Suitable for update full event, and event get
class Event(BaseModel):
    start: datetime.datetime
    end: datetime.datetime
    profesional: ProfesionalResponse
    client: ClientResponse
    speciality: SpecialityResponse

    class Config:
        schema_extra = {            
                "start": "2021-03-03T22:28:26.986Z",
                "end": "2021-03-03T22:28:26.986Z",
                "profesional": 99,
                "client": 12,
                "speciality": 23
            }        


class EventResponse(Event):
    id: int
    created_on: datetime.datetime

    class Config:
        orm_mode = True
    