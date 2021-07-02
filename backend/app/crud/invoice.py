from sqlalchemy.orm import Session
from ..models import Invoice as InvoiceModel, InvoiceDetail as InvoiceDetailModel
from ..schemas.invoice import InvoiceCreate, Invoice, InvoiceDelete


# CASH
def get_invoice(db: Session, invoice_id: int):
    return db.query(InvoiceModel).filter(InvoiceModel.id == invoice_id).first()


def get_invoicees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(InvoiceModel).offset(skip).limit(limit).all()


def create_invoice(db: Session, invoice: InvoiceCreate):
    db_invoice = InvoiceModel(date=invoice.date,
                              invoice=invoice.invoice,
                              order=invoice.order,
                              payment_nro=invoice.payment_nro,
                              payment_method=invoice.payment_method,
                              contact_id=invoice.contact_id
                              )

    db.add(db_invoice)
    db.commit()
    return db_invoice


def update_invoice(db: Session, invoice: InvoiceModel):
    invoice_data = db.query(InvoiceModel).filter(
        InvoiceModel.id == invoice.id).first()
    invoice_data.date = invoice.date
    invoice_data.invoice = invoice.invoice
    invoice_data.order = invoice.order
    invoice_data.payment_nro = invoice.payment_nro
    invoice_data.payment_method = invoice.payment_method
    invoice_data.contact_id = invoice.contact_id
    db.commit()
    db.refresh(invoice_data)
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
