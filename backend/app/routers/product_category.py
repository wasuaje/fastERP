from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db
from ..schemas.product_category import ProductCategory as ProductCategorySchema, ProductCategoryQuickCreate
from ..schemas.product_category import ProductCategoryQuickUpdate, ProductCategoryResponse
from ..schemas.product_category import ProductCategoryDelete
from ..schemas.auth import User
from ..crud.product_category import get_product_categorys, create_product_category
from ..crud.product_category import update_product_category, get_product_category
from ..crud.product_category import delete_product_category

router = APIRouter()

#
# ProductCategory
#
@router.get("/api/product-category/", response_model=List[ProductCategoryResponse],
            tags=["Product-Category"])
def read_product_categories(skip: int = 0, limit: int = 100,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(
                                get_current_active_user)):
    cash = get_product_categorys(db, skip=skip, limit=limit)
    return cash


@router.post("/api/product-category/", response_model=ProductCategoryResponse,
             tags=["Product-Category"])
def create_product_categories(product_category: ProductCategorySchema,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    return create_product_category(db=db, product_category=product_category)


@router.patch("/api/product-category/",
              response_model=ProductCategoryResponse,
              tags=["Product-Category"])
def update_product_categories(product_category: ProductCategoryQuickUpdate,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    db_product = update_product_category(db, product_category)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Product Category not found")
    return db_product


@router.delete("/api/product-category/",
               response_model=ProductCategoryDelete,
               tags=["Product-Category"])
def delete_product_categories(product_category: ProductCategoryDelete,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    db_product = delete_product_category(db, product_category)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Product Category not found")
    return db_product


@router.get("/api/product-category/{product_category_id}", response_model=ProductCategoryResponse, tags=["Product-Category"])
def get_a_product_category(product_category_id: int, db: Session = Depends(get_db),
                           current_user: User = Depends(get_current_active_user)):
    db_product = get_product_category(db, product_category_id=product_category_id)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Product Category not found")
    return db_product

