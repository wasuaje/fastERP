from typing import List, Optional
import datetime
from pydantic import BaseModel


#
# ProductCategory
#
class ProductCategoryBase(BaseModel):
    id: int


class ProductCategoryDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class ProductCategoryQuickCreate(BaseModel):
    name: str
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "My Product Category "
            }
        }


class ProductCategoryQuickUpdate(ProductCategoryBase):
    name: str    
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 999,
                "name": "My ProductCategory "             
            }
        }


# Suitable for update full productCategory, and productCategory get
class ProductCategory(ProductCategoryQuickCreate):    

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "My ProductCategory"
            }
        }


class ProductCategoryResponse(ProductCategory, ProductCategoryQuickCreate):
    id: int

    class Config:
        schema_extra = {
            "example": {
                "name": "My ProductCategory"
                       }
        }
