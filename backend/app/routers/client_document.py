from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.client_document import ClientDocument, ClientDocumentCreate, ClientDocumentDelete, ClientDocumentResponse
from ..schemas.invoice import InvoiceResponse
from ..schemas.auth import User
from ..crud.client_document import get_client_documents, create_client_document, get_pending_client_documents
from ..crud.client_document import get_client_document, delete_client_document, update_client_document
from ..crud.utils import invoice_document
# from fastapi_pagination import paginate, Page


router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Facturacion - ClientDocument
#
@router.get("/api/client-document/", response_model=List[ClientDocumentResponse], tags=["Client-Document"])
def list_client_document(skip: int = 0, limit: int = 100,
                         db: Session = Depends(get_db)):
    client_document = get_client_documents(db, skip=skip, limit=limit)
    return client_document
    # return paginate(client_document)


@router.post("/api/client-document/", response_model=ClientDocument, tags=["Client-Document"])
def create_a_client_document(client_document: ClientDocumentCreate,
                             db: Session = Depends(get_db)):
    return create_client_document(db=db, client_document=client_document)


@router.get("/api/client-document/{client_document_id}", response_model=ClientDocumentResponse,
            tags=["Client-Document"])
def get_a_client_document(client_document_id: int, db: Session = Depends(get_db)):
    db_client_document = get_client_document(
        db, client_document_id=client_document_id)
    if db_client_document is None:
        raise HTTPException(status_code=404, detail="Client Document not found")
    return db_client_document


@router.patch("/api/client-document", response_model=ClientDocument,
              tags=["Client-Document"])
def update_client_documents(client_document: ClientDocument,
                            db: Session = Depends(get_db)):
    db_client = update_client_document(db, client_document)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client Document not found")
    return db_client


@router.delete("/api/client-document/",
               response_model=ClientDocumentDelete,
               tags=["Client-Document"])
def delete_a_client_document(client_document: ClientDocumentDelete,
                             db: Session = Depends(get_db)):
    db_client_document = delete_client_document(db, client_document)
    if db_client_document is None:
        raise HTTPException(status_code=404, detail="Client Document not found")
    return db_client_document

@router.post("/api/client-document/invoice/", response_model=InvoiceResponse, tags=["Client-Document"])
def invoice_a_client_document(client_document: ClientDocumentDelete,
                             db: Session = Depends(get_db)):
    result = invoice_document(db=db, document_id=client_document.id)
    if result is None:
        raise HTTPException(status_code=409, detail="Client Document already invoiced")
    return result