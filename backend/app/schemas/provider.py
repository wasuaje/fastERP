from typing import List, Optional
import datetime
from pydantic import BaseModel


#
# CLIENT
#
class ProviderBase(BaseModel):
    id: int


class ProviderDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class ProviderQuickCreate(BaseModel):
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


class ProviderQuickUpdate(ProviderBase):
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


# Suitable for update full provider, and providers get
class Provider(ProviderQuickCreate):
    date: Optional[datetime.date]
    email: Optional[str]    
    website: Optional[str]
    cuit: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip_code: Optional[str]    

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                 "name": "John Van Dame",
                "phone": "+5491121124334",
                "date": "2021-01-21T00:00:00",
                "email": "johnvdm@gmail.com",
                "website": "www.mydomain.com",
                "address": "My addres, my street",
                "city": "San Martin",
                "state": "Buenos Aires",
                "zip_code": "1650",
                "cuit": "1-100022000-4"               
            }
        }


class ProviderResponse(Provider, ProviderQuickCreate):
    id: int

    class Config:
        schema_extra = {
            "example": {
                "id": 999,
                 "name": "John Van Dame",
                "phone": "+5491121124334",
                "date": "2021-01-21T00:00:00",
                "email": "johnvdm@gmail.com",
                "website": "www.mydomain.com",
                "address": "My addres, my street",
                "city": "San Martin",
                "state": "Buenos Aires",
                "zip_code": "1650",
                "cuit": "1-100022000-4"             
            }
        }
