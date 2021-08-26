from sqlalchemy.orm import Session
from ..models import Product as ProductModel
from ..schemas.product import Product as ProductSchema, ProductQuickCreate
from ..schemas.product import ProductQuickUpdate, ProductDelete, ProductCreate


def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ProductModel).offset(skip).limit(limit).all()


def get_products_with_existence(db: Session, skip: int = 0, limit: int = 100):
    data =  db.query(ProductModel).filter(ProductModel.stock > 0).all()    
    return data


def get_product(db: Session, product_id: int):
    return db.query(ProductModel).filter(
        ProductModel.id == product_id).first()


def create_product(db: Session, product: ProductCreate):
    db_product = ProductModel(name=product.name,
                              price=product.price,
                              code=product.code,
                              cost=product.cost,
                              format=product.format,
                              dct=product.dct,
                              tax=product.tax,
                              stock=product.stock,
                              bar_code=product.bar_code,
                              category_id=product.category_id
                              )
    db.add(db_product)
    db.commit()
    return db_product


def update_product(db: Session, product: ProductSchema):
    product_data = db.query(ProductModel).filter(
        ProductModel.id == product.id).first()
    product_data.name = product.name
    product_data.code = product.code
    product_data.price = product.price
    product_data.cost = product.cost
    product_data.format = product.format
    product_data.dct = product.dct
    product_data.tax = product.tax
    product_data.stock = product.stock
    product_data.bar_code = product.bar_code
    product_data.category_id = product.category_id

    db.commit()
    db.refresh(product_data)
    return product_data


def delete_product(db: Session, product: ProductDelete):
    product_data = db.query(ProductModel).filter(
        ProductModel.id == product.id).first()
    if product_data is None:
        return None
    else:
        db.delete(product_data)
        db.commit()
        return product_data


def quick_create_product(db: Session, product: ProductQuickCreate):
    db_product = ProductModel(name=product.name,
                              price=product.price
                              )
    db.add(db_product)
    db.commit()
    return db_product


def quick_update_product(db: Session, product: ProductQuickUpdate):
    product_data = db.query(ProductModel).filter(
        ProductModel.id == product.id).first()
    product_data.name = product.name
    product_data.price = product.price
    db.commit()
    db.refresh(product_data)
    return product_data
