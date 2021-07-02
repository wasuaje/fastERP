from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db
from ..schemas.product import Product as ProductSchema, ProductQuickCreate
from ..schemas.product import ProductQuickUpdate, ProductResponse, ProductUpdateResponse
from ..schemas.product import ProductDelete, ProductCreate, ProductUpdate
from ..schemas.auth import User
from ..crud.product import get_products, create_product, update_product, get_product
from ..crud.product import quick_create_product, quick_update_product
from ..crud.product import delete_product

router = APIRouter()

#
# Product
#
@router.get("/api/product/", response_model=List[ProductResponse],
            tags=["Product"])
def read_products(skip: int = 0, limit: int = 100,
                  db: Session = Depends(get_db),
                  current_user: User = Depends(
                      get_current_active_user)):
    cash = get_products(db, skip=skip, limit=limit)
    return cash


@router.post("/api/product/", response_model=ProductResponse,
             tags=["Product"])
def create_products(product: ProductCreate,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(
                        get_current_active_user)):
    return create_product(db=db, product=product)


@router.patch("/api/product/",
              response_model=ProductUpdateResponse,
              tags=["Product"])
def update_products(product: ProductUpdate,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(
                        get_current_active_user)):
    db_product = update_product(db, product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@router.delete("/api/product/",
               response_model=ProductDelete,
               tags=["Product"])
def delete_products(product: ProductDelete,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(
                        get_current_active_user)):
    db_product = delete_product(db, product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@router.get("/api/product/{product_id}", response_model=ProductResponse, tags=["Product"])
def get_a_product(product_id: int, db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_active_user)):
    db_product = get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@router.post("/api/product/quickcreate", response_model=ProductQuickUpdate,
             tags=["Product"])
def quick_create_products(product: ProductQuickCreate,
                          db: Session = Depends(get_db),
                          current_user: User = Depends(
                              get_current_active_user)):
    return quick_create_product(db=db, product=product)


@router.patch("/api/product/quickupdate", response_model=ProductQuickUpdate,
              tags=["Product"])
def quick_update_products(product: ProductQuickUpdate,
                          db: Session = Depends(get_db),
                          current_user: User = Depends(
                              get_current_active_user)):
    db_product = quick_update_product(db, product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product
