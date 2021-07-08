from typing import List, Optional
import datetime
from pydantic import BaseModel


#
# User
#
class User(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None
    is_staff: Optional[bool] = None
    is_superuser: Optional[bool] = None

    class Config:
        orm_mode = True


class UserDetailUpdate(User):
    password: str

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 0,
            "username": "client",
            "email": "test@yourserver.com",
            "first_name": "Anreije",
            "last_name": "Summerdale",
            "is_active": True,
            "is_staff": False,
            "is_superuser": False,
            "password": "mystrongpass"
        }


class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None
    is_staff: Optional[bool] = None
    is_superuser: Optional[bool] = None
    password: str
    date_joined: datetime.datetime = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "username": "client",
            "email": "test@yourserver.com",
            "first_name": "Anreije",
            "last_name": "Summerdale",
            "is_active": True,
            "is_staff": False,
            "is_superuser": False
        }


class UserDelete(BaseModel):
    id: int


class UserInDB(User):
    password: str


class UserBase(BaseModel):
    email: str


# AUTH TOKEN
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
