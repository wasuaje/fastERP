from app.schemas.collect import CollectCreate
from sqlalchemy.orm import Session
import sqlalchemy as sa
from ..models import Collect, ClientDocument as ClientDocumentModel, ClientDocumentDetail as ClientDocumentDetailModel
from ..schemas.client_document import ClientDocumentCreate, ClientDocument, ClientDocumentDelete
from .utils import get_next_document_number


def get_client_document(db: Session, client_document_id: int):
    return db.query(ClientDocumentModel).filter(ClientDocumentModel.id == client_document_id).first()


def get_client_documents(db: Session, skip: int = 0, limit: int = 100):
    query = db.query(ClientDocumentModel).all()
    # print(str(query))
    return query


def get_pending_client_documents(db: Session, skip: int = 0, limit: int = 100):
    query = db.query(ClientDocumentModel).outerjoin(Collect).filter(
        ClientDocumentModel.id == Collect.client_document_id, Collect.total < ClientDocumentModel.total).all()
    # print(str(query))
    return query


def create_client_document(db: Session, client_document: ClientDocumentCreate):
    db_client_document = ClientDocumentModel(date=client_document.date,
                                             document_type_id=client_document.document_type_id,
                                             due_date=client_document.due_date,
                                             document=client_document.document,
                                             client_id=client_document.client_id,
                                             employee_id=client_document.employee_id,                                             
                                             dct=client_document.dct,
                                             tax=client_document.tax,                                             
                                             body_note=client_document.body_note,
                                             foot_note=client_document.foot_note,
                                             affect_inventory=client_document.affect_inventory,
                                             )

    db_client_document.document = get_next_document_number(db, client_document.document_type_id)
    db.add(db_client_document)
    db.commit()
    return db_client_document


def update_client_document(db: Session, client_document: ClientDocumentModel):
    client_document_data = db.query(ClientDocumentModel).filter(
        ClientDocumentModel.id == client_document.id).first()
    client_document_data.document_type_id = client_document.document_type_id
    client_document_data.date = client_document.date    
    client_document_data.due_date = client_document.due_date
    client_document_data.document = client_document.document    
    client_document_data.body_note = client_document.body_note
    client_document_data.foot_note = client_document.foot_note
    client_document_data.dct = client_document.dct
    client_document_data.tax = client_document.tax    
    client_document_data.client_id = client_document.client_id
    client_document_data.employee_id = client_document.employee_id
    client_document_data.affect_inventory=client_document.affect_inventory
    db.commit()
    db.refresh(client_document_data)
    # refresh_client_document(db, client_document_data.id)
    return client_document_data


def delete_client_document(db: Session, client_document: ClientDocumentDelete):
    client_document_data = db.query(ClientDocumentModel).filter(
        ClientDocumentModel.id == client_document.id).first()
    if client_document_data is None:
        return None
    else:
        db.delete(client_document_data)
        db.commit()
        return client_document_data
