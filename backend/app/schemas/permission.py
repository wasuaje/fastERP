from typing import List, Optional
import datetime

from .auth import User
from pydantic import BaseModel


#
# User
#
class Permission(BaseModel):
    id: int
    path: str
    can_list: int
    can_get: int
    can_post: int
    can_patch: int
    can_delete: int
    created_on: Optional[datetime.datetime] = datetime.datetime.now()
    user: User

    class Config:
        orm_mode = True
        schema_extra = {
            "path": "client",
            "can_list": 1,
            "can_get": 0,
            "can_post": 0,
            "can_patch": 0,
            "can_delete": 0,
            "user": {
                    "id": 0,
                    "username": "string",
                    "email": "string",
                    "first_name": "string",
                    "last_name": "string",
                    "is_active": 1,
                    "is_staff": 1
            }
        }


class PermissionCreate(BaseModel):
    path: str
    can_list: int
    can_get: int
    can_post: int
    can_patch: int
    can_delete: int
    user_id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "path": "client",
            "can_list": 1,
            "can_get": 0,
            "can_post": 0,
            "can_patch": 0,
            "can_delete": 0,
            "user_id": 8888
        }


class PermissionDelete(BaseModel):    
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 0            
        }

# class UserDetailUpdate(User):
#     password: str


# class UserInDB(User):
#     password: str


# class UserBase(BaseModel):
#     email: str


# class UserCreate(UserBase):
#     password: str


# # AUTH TOKEN
# class Token(BaseModel):
#     access_token: str
#     token_type: str


# class TokenData(BaseModel):
#     username: Optional[str] = None
