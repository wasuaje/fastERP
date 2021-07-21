from sqlalchemy.orm import Session
import sqlalchemy as sa
from ..models import Invoice as InvoiceModel, InvoiceDetail as InvoiceDetailModel
from ..schemas.invoice import InvoiceCreate, Invoice, InvoiceDelete
from .invoice_detail import update_invoice as refresh_invoice

# CASH
def get_invoice(db: Session, invoice_id: int):
    return db.query(InvoiceModel).filter(InvoiceModel.id == invoice_id).first()


def get_invoicees(db: Session, skip: int = 0, limit: int = 100):
    query = db.query(InvoiceModel).offset(skip).limit(limit).all()
    return query


def create_invoice(db: Session, invoice: InvoiceCreate):
    db_invoice = InvoiceModel(date=invoice.date,
                              due_date=invoice.due_date,
                              invoice=invoice.invoice,
                              order=invoice.order,                              
                              contact_id=invoice.contact_id,
                              profesional_id=invoice.profesional_id,                              
                              dct=invoice.dct,
                              tax=invoice.tax,                              
                              body_note=invoice.body_note,
                              foot_note=invoice.foot_note,
                              )

    db.add(db_invoice)
    db.commit()
    return db_invoice


def update_invoice(db: Session, invoice: InvoiceModel):
    invoice_data = db.query(InvoiceModel).filter(
        InvoiceModel.id == invoice.id).first()
    invoice_data.date = invoice.date
    invoice_data.due_date = invoice.due_date
    invoice_data.invoice = invoice.invoice
    invoice_data.order = invoice.order
    invoice_data.body_note = invoice.body_note
    invoice_data.foot_note = invoice.foot_note
    invoice_data.dct = invoice.dct
    invoice_data.tax = invoice.tax
    invoice_data.contact_id = invoice.contact_id
    invoice_data.profesional_id=invoice.profesional_id
    db.commit()
    db.refresh(invoice_data)
    refresh_invoice(db, invoice_data.id)
    return invoice_data


def delete_invoice(db: Session, invoice: InvoiceDelete):
    invoice_data = db.query(InvoiceModel).filter(
        InvoiceModel.id == invoice.id).first()
    if invoice_data is None:
        return None
    else:
        db.delete(invoice_data)
        db.commit()
        return invoice_data
