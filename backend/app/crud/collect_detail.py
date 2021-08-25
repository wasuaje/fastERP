from sqlalchemy.orm import Session
from sqlalchemy.util.langhelpers import ellipses_string
from ..models import CollectDetail as CollectDetailModel, Collect, Cash
from ..schemas.collect_detail import CollectDetail as CollectDetailSchema, CollectDetailDelete
from .utils import get_open_cash, add_automatic_collect


def update_collect(db, collect_id, amount, operation):
    collect = db.query(Collect).filter(
        Collect.id == collect_id).first()
    # print(collect.invoice.invoice)
    if operation == '+':
        collect.total = collect.total + amount
        collect.invoice.collected = collect.invoice.collected + amount
    elif operation == '-':
        collect.total = collect.total - amount
        collect.invoice.collected = collect.invoice.collected - amount
    else:
        pass
    db.commit()
    db.refresh(collect)


def get_collect_details(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CollectDetailModel).offset(skip).limit(limit).all()


def get_collect_detail(db: Session, collect_id: int):
    return db.query(CollectDetailModel).filter(
        CollectDetailModel.collect_id == collect_id).all()


def create_collect_detail(db: Session, collect_detail: CollectDetailSchema):
    cash: Cash = get_open_cash(db)
    
    if cash is None:        #There is no cash or more than one opened
        return None

    db_collect_detail = CollectDetailModel(amount=collect_detail.amount,
                                           reference=collect_detail.reference,
                                           bank_id=collect_detail.bank_id,
                                           payment_method_id=collect_detail.payment_method_id,
                                           collect_id=collect_detail.collect_id,
                                           )
    db.add(db_collect_detail)
    db.commit()
    # update_invoice(db,collect_detail.invoice_id)
    update_collect(db, db_collect_detail.collect_id,db_collect_detail.amount,'+')
    if db_collect_detail.payment_method.name == 'Efectivo':
        concept = f"Ingreso AUTO. FACT: {db_collect_detail.collect.invoice.invoice} - Cliente: {db_collect_detail.collect.invoice.client.name}"
        amount = db_collect_detail.amount
        add_automatic_collect(db, concept, amount)
    return db_collect_detail


def update_collect_detail(db: Session, collect_detail: CollectDetailSchema):
    collect_detail_data = db.query(CollectDetailModel).filter(
        CollectDetailModel.id == collect_detail.id).first()
    collect_detail_data.amount = collect_detail.amount
    collect_detail_data.reference = collect_detail.reference
    collect_detail_data.bank_id = collect_detail.bank_id
    collect_detail_data.payment_method_id = collect_detail.payment_method_id
    collect_detail_data.collect_id = collect_detail.collect_id    
    db.commit()
    db.refresh(collect_detail_data)
    return collect_detail_data


# TODO: Increase stock by collect.detail.qtty in product
def delete_collect_detail(db: Session, collect_detail: CollectDetailDelete):
    cash: Cash = get_open_cash(db)
    
    if cash is None:        #There is no cash or more than one opened
        return None

    collect_detail_data = db.query(CollectDetailModel).filter(
        CollectDetailModel.id == collect_detail.id).first()
    if collect_detail_data is None:
        return None
    else:
        if collect_detail_data.payment_method.name == 'Efectivo':
            concept = f"Reverso AUTO. FACT: {collect_detail_data.collect.invoice.invoice} - Cliente: {collect_detail_data.collect.invoice.client.name}"
            amount = collect_detail_data.amount
            add_automatic_collect(db, concept, amount*-1)
        db.delete(collect_detail_data)
        db.commit()
        # update_invoice(db,collect_detail_data.invoice_id)
        update_collect(db, collect_detail_data.collect_id,collect_detail_data.amount,'-')
        return collect_detail_data
