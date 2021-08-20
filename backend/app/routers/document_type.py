from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.document_type import DocumentType as DocumentTypeSchema, DocumentTypeQuickCreate
from ..schemas.document_type import DocumentTypeQuickUpdate, DocumentTypeResponse
from ..schemas.document_type import DocumentTypeDelete
from ..schemas.auth import User
from ..crud.document_type import get_document_types, create_document_type
from ..crud.document_type import update_document_type, get_document_type
from ..crud.document_type import delete_document_type

router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# DocumentType
#
@router.get("/api/document-type/", response_model=List[DocumentTypeResponse],
            tags=["Document-Type"])
def read_document_types(skip: int = 0, limit: int = 100,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(
                                get_current_active_user)):
    cash = get_document_types(db, skip=skip, limit=limit)
    return cash


@router.post("/api/document-type/", response_model=DocumentTypeResponse,
             tags=["Document-Type"])
def create_document_types(document_type: DocumentTypeSchema,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    return create_document_type(db=db, document_type=document_type)


@router.patch("/api/document-type/",
              response_model=DocumentTypeResponse,
              tags=["Document-Type"])
def update_document_types(document_type: DocumentTypeQuickUpdate,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    db_product = update_document_type(db, document_type)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Document Type not found")
    return db_product


@router.delete("/api/document-type/",
               response_model=DocumentTypeDelete,
               tags=["Document-Type"])
def delete_document_typees(document_type: DocumentTypeDelete,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    db_product = delete_document_type(db, document_type)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Document Type not found")
    return db_product


@router.get("/api/document-type/{document_type_id}", response_model=DocumentTypeResponse, tags=["Document-Type"])
def get_a_document_type(document_type_id: int, db: Session = Depends(get_db),
                           current_user: User = Depends(get_current_active_user)):
    db_product = get_document_type(db, document_type_id=document_type_id)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Document Type not found")
    return db_product

