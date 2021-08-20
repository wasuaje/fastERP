from sqlalchemy.orm import Session
from sqlalchemy.util.langhelpers import ellipses_string
from ..models import ClientDocumentDetail as ClientDocumentDetailModel, ClientDocument, Product
from ..schemas.client_document_detail import ClientDocumentDetail as ClientDocumentDetailSchema, ClientDocumentDetailDelete


def update_client_document(db: Session, client_document_id):
    client_document = db.query(ClientDocument).filter(
        ClientDocument.id == client_document_id).first()
    subtotal = 0.00
    dct_total = 0.00
    tax_total = 0.00
    for detail in client_document.client_document_detail:
        subtotal+=detail.total
    dct_total = subtotal * (client_document.dct/100)
    tax_total = (subtotal-dct_total) * (client_document.tax/100)
    client_document.subtotal=subtotal        
    client_document.total=subtotal-dct_total+tax_total
    db.commit()    
    db.refresh(client_document)


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
    

def get_client_document_details(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ClientDocumentDetailModel).offset(skip).limit(limit).all()


def get_client_document_detail(db: Session, client_document_id: int):    
    return db.query(ClientDocumentDetailModel).filter(
        ClientDocumentDetailModel.client_document_id == client_document_id).all()


def create_client_document_detail(db: Session, client_document_detail: ClientDocumentDetailSchema):
    db_client_document_detail = ClientDocumentDetailModel(qtty=client_document_detail.qtty,
                                           price=client_document_detail.price,
                                           client_document_id=client_document_detail.client_document_id,
                                           product_id=client_document_detail.product_id                                           
                                           )
    db.add(db_client_document_detail)
    db.commit()
    update_client_document(db,client_document_detail.client_document_id)
    if db_client_document_detail.client_document.affect_inventory:
        update_inventory(db, db_client_document_detail.product_id,db_client_document_detail.qtty,'-')
    return db_client_document_detail


def update_client_document_detail(db: Session, client_document_detail: ClientDocumentDetailSchema):
    client_document_detail_data = db.query(ClientDocumentDetailModel).filter(
        ClientDocumentDetailModel.id == client_document_detail.id).first()
    client_document_detail_data.qtty = client_document_detail.qtty
    client_document_detail_data.price = client_document_detail.price
    client_document_detail_data.client_document_id = client_document_detail.client_document_id
    client_document_detail_data.product_id = client_document_detail.product_id    
    db.commit()
    db.refresh(client_document_detail_data)
    return client_document_detail_data


# TODO: Increase stock by client_document.detail.qtty in product
def delete_client_document_detail(db: Session, client_document_detail: ClientDocumentDetailDelete):
    client_document_detail_data = db.query(ClientDocumentDetailModel).filter(
        ClientDocumentDetailModel.id == client_document_detail.id).first()    
    if client_document_detail_data is None:
        return None
    else:
        affect_inventory = client_document_detail_data.client_document.affect_inventory
        db.delete(client_document_detail_data)
        db.commit()
        update_client_document(db,client_document_detail_data.client_document_id)
        if affect_inventory:
            update_inventory(db, client_document_detail_data.product_id,client_document_detail_data.qtty,'+')
        return client_document_detail_data
