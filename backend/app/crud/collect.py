from sqlalchemy.orm import Session
import sqlalchemy as sa
from ..models import Collect as CollectModel, CollectDetail as CollectDetailModel
from ..schemas.collect import CollectCreate, Collect, CollectDelete
# from .collect_detail import update_collect as refresh_collect

# CASH
def get_collect(db: Session, collect_id: int):
    return db.query(CollectModel).filter(CollectModel.id == collect_id).first()


def get_collects(db: Session, skip: int = 0, limit: int = 100):
    query = db.query(CollectModel).offset(skip).limit(limit).all()
    return query


def create_collect(db: Session, collect: CollectCreate):
    db_collect = CollectModel(date=collect.date,                              
                              description=collect.description,
                              invoice_id=collect.invoice_id                              
                              )

    db.add(db_collect)
    db.commit()
    return db_collect


def update_collect(db: Session, collect: CollectModel):
    collect_data = db.query(CollectModel).filter(
        CollectModel.id == collect.id).first()
    collect_data.date = collect.date    
    collect_data.description = collect.description
    collect_data.invoice_id = collect.invoice_id
    db.commit()
    db.refresh(collect_data)
    # refresh_collect(db, collect_data.id)
    return collect_data


def delete_collect(db: Session, collect: CollectDelete):
    collect_data = db.query(CollectModel).filter(
        CollectModel.id == collect.id).first()
    if collect_data is None:
        return None
    else:
        db.delete(collect_data)
        db.commit()
        return collect_data
