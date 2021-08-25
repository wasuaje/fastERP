from sqlalchemy.orm import Session
from app.schemas.client_document import ClientDocumentDelete
from ..models import CashDetail, ClientDocument, ClientDocumentDetail, Configuration
from ..models import Cash, DocumentType, Invoice, InvoiceDetail
from .invoice_detail import update_invoice, update_inventory


def get_next_document_number(db: Session, doc_type_id):
    # Getting system PADLEFT for documents
    doc_padleft_record = db.query(Configuration).filter(
        Configuration.config_name == 'doc_pad_left_value').first()
    doc_padleft = int(doc_padleft_record.config_value)

    # Getting document type code ND, NC, etc
    if isinstance(doc_type_id, str):    # receives nd, nc, nd
        doc_type_record = db.query(DocumentType).filter(
            DocumentType.code == doc_type_id.upper()).first()
    else:  # receives and id, 1,2,3 ...n
        doc_type_record = db.query(DocumentType).filter(
            DocumentType.id == doc_type_id).first()
    doc_type = doc_type_record.code.lower()

    # Getting the actual document form for the requested doc type
    doc_number_record = db.query(Configuration).filter(
        Configuration.config_name == f'{doc_type}_document_number').first()
    doc_number = doc_number_record.config_value

    new_doc_number = int(doc_number)+1
    doc_number_record.config_value = new_doc_number
    db.commit()
    db.refresh(doc_number_record)
    return "0"*(doc_padleft-len(str(new_doc_number)))+str(new_doc_number)


# Transform a documento into an invoucec
def invoice_document(db: Session, document_id):
    # getting current document record
    document_record = db.query(ClientDocument).filter(
        ClientDocument.id == document_id).first()

    if document_record.status == 1:
        return None

    # getting current document detail record
    document_detail_record = db.query(ClientDocumentDetail).filter(
        ClientDocumentDetail.client_document_id == document_id).all()

    # invoice master document
    new_invoice = Invoice(
        date=document_record.date,
        due_date=document_record.due_date,
        invoice='',
        order=document_record.id,
        client_id=document_record.client_id,
        employee_id=document_record.employee_id,
        dct=document_record.dct,
        tax=document_record.tax,
        body_note=document_record.body_note,
        foot_note=document_record.foot_note)

    new_invoice.invoice = get_next_document_number(db, 'fv')
    db.add(new_invoice)
    db.commit()

    # invoicing detail
    for doc_detail in document_detail_record:
        new_invoice_detail = InvoiceDetail(
            qtty=doc_detail.qtty,
            price=doc_detail.price,
            invoice_id=new_invoice.id,
            product_id=doc_detail.product_id)
        
        db.add(new_invoice_detail)
        db.commit()
        update_invoice(db, new_invoice.id)
        update_inventory(db, doc_detail.product_id, doc_detail.qtty, '-')
    
    # set document as processed status=1
    document_record.status=1
    db.commit()    
    db.refresh(document_record)

    return new_invoice

def get_open_cash(db: Session):
    # Getting open cash
    open_cash_record = db.query(Cash).filter(
        Cash.status == 0).all()
    if len(open_cash_record) > 1 or len(open_cash_record) == 0:
        return None
    else:
        return open_cash_record[0]


def add_automatic_collect(db: Session, concept, amount):
    open_cash = get_open_cash(db)
    cash_detail = CashDetail(concept=concept, amount=amount, cash_id=open_cash.id)    
    db.add(cash_detail)
    db.commit()



