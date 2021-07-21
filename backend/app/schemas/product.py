from typing import List, Optional
import datetime
from pydantic import BaseModel
from .product_category import ProductCategoryResponse


#
# Product
#
class ProductBase(BaseModel):
    id: int


class ProductDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class ProductQuickCreate(BaseModel):
    name: str
    price: float    

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "My Product ",
                "price": 123.91
            }
        }


class ProductQuickUpdate(ProductBase):
    name: str
    price: float
    stock: int
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 999,
                "name": "My Product ",
                "stock": 23,
                "price": 123.91
            }
        }


# Suitable for product get
class Product(ProductQuickCreate):
    code: str
    price: float
    cost: float
    format: str    
    dct: Optional[float]
    tax: Optional[float]
    stock: Optional[int]
    bar_code: Optional[str]    

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "code": "A01",
                "name": "My Product",
                "format": "2 x 200 grs",
                "category_id": 999,
                "price": 123.91,
                "cost": 100.00,
                "stock": 2,
                "bar_code": "1111222233334444",
                "dct": 2.01,
                "tax": 3.03
            }
        }


# Suitable for product create full
class ProductCreate(ProductQuickCreate):
    code: str
    price: float
    cost: float
    format: str
    dct: Optional[float]
    tax: Optional[float]
    stock: Optional[int]
    bar_code: Optional[str]    
    category_id: Optional[int]

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "code": "A01",
                "name": "My Product",
                "format": "2 x 200 grs",
                "category_id": 999,
                "price": 123.91,
                "cost": 100.00,
                "stock": 2,
                "bar_code": "1111222233334444",
                "dct": 2.01,
                "tax": 3.03
            }
        }


class ProductResponse(Product, ProductQuickCreate):
    id: int        
    category: Optional[ProductCategoryResponse]

    class Config:
        schema_extra = {            
                "name": "My Product",                
                "stock": 999,
                "bar_code" "1111222233334444"
                "price": 123.91,
                "dct": 2.21,
                "tax": 3.01
        }


class ProductUpdate(ProductBase):
    code: str
    name: str    
    price: float
    cost: float
    format: str
    dct: Optional[float]
    tax: Optional[float]
    stock: Optional[int]
    bar_code: Optional[str]    
    category_id: Optional[int]

    class Config:
        schema_extra = {            
                "name": "My Product",
                "category_id": 9,
                "stock": 999,
                "bar_code" "1111222233334444"
                "price": 123.91,
                "dct": 2.21,
                "tax": 3.01
        }


class ProductUpdateResponse(ProductQuickCreate):
    code: str
    price: float
    cost: float
    format: str
    dct: Optional[float]
    tax: Optional[float]
    stock: Optional[int]
    bar_code: Optional[str]    
    category: Optional[ProductCategoryResponse]

    class Config:
        schema_extra = {            
                "name": "My Product",
                "category_id": 99,
                "stock": 999,
                "bar_code" "1111222233334444"
                "price": 123.91,
                "dct": 2.21,
                "tax": 3.01
        }



