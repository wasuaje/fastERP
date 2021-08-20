from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.client_document_detail import ClientDocumentDetail, ClientDocumentDetailResponse
from ..schemas.client_document_detail import ClientDocumentDetailDelete, ClientDocumentDetailCreate
from ..schemas.auth import User
from ..crud.client_document_detail import get_client_document_details, create_client_document_detail
from ..crud.client_document_detail import delete_client_document_detail, update_client_document_detail
from ..crud.client_document_detail import get_client_document_detail


router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Documentos Cliente Detalle - ClientDocumentDetail
#
@router.get("/api/client-document-detail/", response_model=List[ClientDocumentDetailResponse],
            tags=["ClientDocument-Detail"])
def read_client_document_details(skip: int = 0, limit: int = 100,
                                 db: Session = Depends(get_db),
                                 current_user: User = Depends(
                                     get_current_active_user)):
    client_document_detail = get_client_document_details(
        db, skip=skip, limit=limit)
    return client_document_detail

@router.post("/api/client-document-detail/", response_model=ClientDocumentDetailCreate,
             tags=["ClientDocument-Detail"])
def create_client_document_details(client_document_detail: ClientDocumentDetailCreate,
                                   db: Session = Depends(get_db),
                                   current_user: User = Depends(
                                       get_current_active_user)):
    return create_client_document_detail(db=db, client_document_detail=client_document_detail)

# not sure if worht thinking about stock


@router.patch("/api/client-document-detail/",
              response_model=ClientDocumentDetail,
              tags=["ClientDocument-Detail"])
def update_client_document_details(client_document_detail: ClientDocumentDetail,
                                   db: Session = Depends(get_db),
                                   current_user: User = Depends(
                                       get_current_active_user)):
    db_client_document_detail = update_client_document_detail(
        db, client_document_detail)
    if db_client_document_detail is None:
        raise HTTPException(
            status_code=404, detail="Client Document Detail not found")
    return db_client_document_detail


@router.delete("/api/client-document-detail/",
               response_model=ClientDocumentDetailDelete,
               tags=["ClientDocument-Detail"])
def delete_client_document_details(client_document_detail: ClientDocumentDetailDelete,
                                   db: Session = Depends(get_db),
                                   current_user: User = Depends(
                                       get_current_active_user)):
    db_client_document_detail = delete_client_document_detail(
        db, client_document_detail)
    if db_client_document_detail is None:
        raise HTTPException(
            status_code=404, detail="Client Document Detail not found")
    return db_client_document_detail


@router.get("/api/client-document-detail/{client_document_id}", response_model=List[ClientDocumentDetailResponse], tags=["ClientDocument-Detail"])
def get_a_client_document_detail(client_document_id: int, db: Session = Depends(get_db),
                                 current_user: User = Depends(get_current_active_user)):
    db_client_document_detail = get_client_document_detail(
        db, client_document_id=client_document_id)
    if db_client_document_detail is None:
        raise HTTPException(
            status_code=404, detail="Client Document Detail not found")
    return db_client_document_detail
