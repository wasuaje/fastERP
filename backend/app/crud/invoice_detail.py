from sqlalchemy.orm import Session
from sqlalchemy.util.langhelpers import ellipses_string
from ..models import InvoiceDetail as InvoiceDetailModel, Invoice, Product
from ..schemas.invoice_detail import InvoiceDetail as InvoiceDetailSchema, InvoiceDetailDelete



def update_invoice(db: Session, invoice_id):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id).first()
    subtotal = 0.00
    dct_total = 0.00
    tax_total = 0.00
    for detail in invoice.invoice_detail:
        subtotal+=detail.total
    dct_total = subtotal * (invoice.dct/100)
    tax_total = (subtotal-dct_total) * (invoice.tax/100)
    invoice.subtotal=subtotal        
    invoice.total=subtotal-dct_total+tax_total
    db.commit()    
    db.refresh(invoice)


def update_inventory(db, product_id, qtty, operation):
    product = db.query(Product).filter(
        Product.id == product_id).first()
    if operation == '+':
        product.stock = product.stock + qtty
    elif operation == '-':
        product.stock = product.stock - qtty
    else:
        pass
    db.commit()    
    db.refresh(product)
    

def get_invoice_details(db: Session, skip: int = 0, limit: int = 100):
    return db.query(InvoiceDetailModel).offset(skip).limit(limit).all()


def get_invoice_detail(db: Session, invoice_id: int):    
    return db.query(InvoiceDetailModel).filter(
        InvoiceDetailModel.invoice_id == invoice_id).all()


def create_invoice_detail(db: Session, invoice_detail: InvoiceDetailSchema):
    db_invoice_detail = InvoiceDetailModel(qtty=invoice_detail.qtty,
                                           price=invoice_detail.price,
                                           invoice_id=invoice_detail.invoice_id,
                                           product_id=invoice_detail.product_id                                           
                                           )
    db.add(db_invoice_detail)
    db.commit()
    update_invoice(db,invoice_detail.invoice_id)
    update_inventory(db, db_invoice_detail.product_id,db_invoice_detail.qtty,'-')
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
        update_invoice(db,invoice_detail_data.invoice_id)
        update_inventory(db, invoice_detail_data.product_id,invoice_detail_data.qtty,'+')
        return invoice_detail_data
