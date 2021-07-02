from sqlalchemy.orm import Session
from ..models import ProductCategory as ProductCategoryModel
from ..schemas.product_category import ProductCategory as ProductCategorySchema, ProductCategoryQuickCreate
from ..schemas.product_category import ProductCategoryQuickUpdate, ProductCategoryDelete


def get_product_categorys(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ProductCategoryModel).offset(skip).limit(limit).all()


def get_product_category(db: Session, product_category_id: int):
    return db.query(ProductCategoryModel).filter(
        ProductCategoryModel.id == product_category_id).first()


def create_product_category(db: Session, product_category: ProductCategorySchema):
    db_product_category = ProductCategoryModel(name=product_category.name,                              
                              )
    db.add(db_product_category)
    db.commit()
    return db_product_category


def update_product_category(db: Session, product_category: ProductCategoryQuickUpdate):
    product_category_data = db.query(ProductCategoryModel).filter(
        ProductCategoryModel.id == product_category.id).first()
    product_category_data.name = product_category.name    

    db.commit()
    db.refresh(product_category_data)
    return product_category_data


def delete_product_category(db: Session, product_category: ProductCategoryDelete):
    product_category_data = db.query(ProductCategoryModel).filter(
        ProductCategoryModel.id == product_category.id).first()
    if product_category_data is None:
        return None
    else:
        db.delete(product_category_data)
        db.commit()
        return product_category_data
