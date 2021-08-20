from sqlalchemy.orm import Session
from ..models import DocumentType as DocumentTypeModel
from ..schemas.document_type import DocumentType as DocumentTypeSchema, DocumentTypeQuickCreate
from ..schemas.document_type import DocumentTypeQuickUpdate, DocumentTypeDelete


def get_document_types(db: Session, skip: int = 0, limit: int = 100):
    return db.query(DocumentTypeModel).offset(skip).limit(limit).all()


def get_document_type(db: Session, document_type_id: int):
    return db.query(DocumentTypeModel).filter(
        DocumentTypeModel.id == document_type_id).first()


def create_document_type(db: Session, document_type: DocumentTypeSchema):
    db_document_type = DocumentTypeModel(name=document_type.name,
                                         code=document_type.code,
                                         )
    db.add(db_document_type)
    db.commit()
    return db_document_type


def update_document_type(db: Session, document_type: DocumentTypeQuickUpdate):
    document_type_data = db.query(DocumentTypeModel).filter(
        DocumentTypeModel.id == document_type.id).first()
    document_type_data.name = document_type.name
    document_type_data.code = document_type.code

    db.commit()
    db.refresh(document_type_data)
    return document_type_data


def delete_document_type(db: Session, document_type: DocumentTypeDelete):
    document_type_data = db.query(DocumentTypeModel).filter(
        DocumentTypeModel.id == document_type.id).first()
    if document_type_data is None:
        return None
    else:
        db.delete(document_type_data)
        db.commit()
        return document_type_data
