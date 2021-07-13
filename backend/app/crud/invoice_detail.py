from sqlalchemy.orm import Session
from ..models import InvoiceDetail as InvoiceDetailModel
from ..schemas.invoice_detail import InvoiceDetail as InvoiceDetailSchema, InvoiceDetailDelete


def get_invoice_details(db: Session, skip: int = 0, limit: int = 100):
    return db.query(InvoiceDetailModel).offset(skip).limit(limit).all()


def get_invoice_detail(db: Session, invoice_id: int):
    return db.query(InvoiceDetailModel).filter(
        InvoiceDetailModel.invoice_id == invoice_id).all()


# TODO: Decrease stock by invoice.detail.qtty in product
def create_invoice_detail(db: Session, invoice_detail: InvoiceDetailSchema):
    db_invoice_detail = InvoiceDetailModel(qtty=invoice_detail.qtty,
                                           price=invoice_detail.price,
                                           invoice_id=invoice_detail.invoice_id,
                                           product_id=invoice_detail.product_id                                           
                                           )
    db.add(db_invoice_detail)
    db.commit()
    return db_invoice_detail


def update_invoice_detail(db: Session, invoice_detail: InvoiceDetailSchema):
    invoice_detail_data = db.query(InvoiceDetailModel).filter(
        InvoiceDetailModel.id == invoice_detail.id).first()
    invoice_detail_data.qtty = invoice_detail.qtty
    invoice_detail_data.price = invoice_detail.price
    invoice_detail_data.invoice_id = invoice_detail.invoice_id
    invoice_detail_data.product_id = invoice_detail.product_id    
    db.commit()
    db.refresh(invoice_detail_data)
    return invoice_detail_data


# TODO: Increase stock by invoice.detail.qtty in product
def delete_invoice_detail(db: Session, invoice_detail: InvoiceDetailDelete):
    invoice_detail_data = db.query(InvoiceDetailModel).filter(
        InvoiceDetailModel.id == invoice_detail.id).first()
    if invoice_detail_data is None:
        return None
    else:
        db.delete(invoice_detail_data)
        db.commit()
        return invoice_detail_data
