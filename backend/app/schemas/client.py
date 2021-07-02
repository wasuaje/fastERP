from typing import List, Optional
import datetime
from pydantic import BaseModel


#
# CLIENT
#
class ClientBase(BaseModel):
    id: int


class ClientDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class ClientQuickCreate(BaseModel):
    name: str
    phone: str
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "John Van Dame",
                "phone": "+5491121124334"
            }
        }


class ClientQuickUpdate(ClientBase):
    name: str
    phone: str
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 999,
                "name": "John Van Dame",
                "phone": "+5491121124334"
            }
        }


# Suitable for update full client, and clients get
class Client(ClientQuickCreate):
    date: Optional[datetime.datetime]
    age: Optional[int]
    gender: Optional[str]
    email: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip_code: Optional[str]
    dob: Optional[str]
    driver_id: Optional[str]
    auth_area: Optional[str]
    auth_color: Optional[str]
    acceptance: Optional[str]

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "John Van Dame",
                "phone": "+5491121124334",
                "date": "2021-01-21T00:00:00",
                "age": 29,
                "gender": "M",
                "email": "johnvdm@gmail.com",
                "address": "My addres, my street",
                "city": "San Martin",
                "state": "Buenos Aires",
                "zip_code": "1650",
                "dob": "1100022",
                "driver_id": "223232232",
                "auth_area": "111111112",
                "auth_color": "32323222",
                "acceptance": 0
            }
        }


class ClientResponse(Client, ClientQuickCreate):
    id: int

    class Config:
        schema_extra = {
            "example": {
                "id": 999,
                "name": "John Van Dame",
                "phone": "+5491121124334",
                "name": "John Van Dame",
                "phone": "+5491121124334",
                "date": "2021-01-21T00:00:00",
                "age": 29,
                "gender": "M",
                "email": "johnvdm@gmail.com",
                "address": "My addres, my street",
                "city": "San Martin",
                "state": "Buenos Aires",
                "zip_code": "1650",
                "dob": "1100022",
                "driver_id": "223232232",
                "auth_area": "111111112",
                "auth_color": "32323222",
                "acceptance": 0
            }
        }
