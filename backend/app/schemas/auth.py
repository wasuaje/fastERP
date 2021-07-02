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

    class Config:
        orm_mode = True


class UserDetailUpdate(User):
    password: str


class UserInDB(User):
    password: str


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


# AUTH TOKEN
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
