from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db
from ..schemas.client import Client as ClientSchema, ClientQuickCreate
from ..schemas.client import ClientQuickUpdate, ClientResponse, ClientDelete
from ..schemas.auth import User
from ..crud.client import get_clients, create_client, update_client, get_client
from ..crud.client import quick_create_client, quick_update_client
from ..crud.client import delete_client

router = APIRouter()

#
# Cliente - Client
#
@router.get("/api/client/", response_model=List[ClientResponse],
            tags=["Client"])
def read_clients(skip: int = 0, limit: int = 100,
                 db: Session = Depends(get_db),
                 current_user: User = Depends(
                     get_current_active_user)):
    client = get_clients(db, skip=skip, limit=limit)
    return client


@router.post("/api/client/", response_model=ClientResponse,
             tags=["Client"])
def create_clients(client: ClientSchema,
                   db: Session = Depends(get_db),
                   current_user: User = Depends(
                       get_current_active_user)):
    return create_client(db=db, client=client)


@router.patch("/api/client/",
              response_model=ClientResponse,
              tags=["Client"])
def update_clients(client: ClientResponse,
                   db: Session = Depends(get_db),
                   current_user: User = Depends(
                       get_current_active_user)):
    db_client = update_client(db, client)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client


@router.delete("/api/client/",
               response_model=ClientDelete,
               tags=["Client"])
def delete_clients(client: ClientDelete,
                   db: Session = Depends(get_db),
                   current_user: User = Depends(
                       get_current_active_user)):
    db_client = delete_client(db, client)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client


@router.get("/api/client/{client_id}", response_model=ClientResponse, tags=["Client"])
def get_a_client(client_id: int, db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_active_user)):
    db_client = get_client(db, client_id=client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client


@router.post("/api/client/quickcreate", response_model=ClientQuickUpdate,
             tags=["Client"])
def quick_create_clients(client: ClientQuickCreate,
                         db: Session = Depends(get_db),
                         current_user: User = Depends(
                             get_current_active_user)):
    return quick_create_client(db=db, client=client)


@router.patch("/api/client/quickupdate", response_model=ClientQuickUpdate,
              tags=["Client"])
def quick_update_clients(client: ClientQuickUpdate,
                         db: Session = Depends(get_db),
                         current_user: User = Depends(
                             get_current_active_user)):
    db_client = quick_update_client(db, client)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client
