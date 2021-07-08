from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.provider import Provider as ProviderSchema, ProviderQuickCreate
from ..schemas.provider import ProviderQuickUpdate, ProviderResponse, ProviderDelete
from ..schemas.auth import User
from ..crud.provider import get_providers, create_provider, update_provider, get_provider
from ..crud.provider import quick_create_provider, quick_update_provider
from ..crud.provider import delete_provider

router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Providere - Provider
#
@router.get("/api/provider/", response_model=List[ProviderResponse],
            tags=["Provider"])
def read_providers(skip: int = 0, limit: int = 100,
                   db: Session = Depends(get_db),
                   current_user: User = Depends(
                       get_current_active_user)):
    provider = get_providers(db, skip=skip, limit=limit)
    return provider


@router.post("/api/provider/", response_model=ProviderResponse,
             tags=["Provider"])
def create_providers(provider: ProviderSchema,
                     db: Session = Depends(get_db),
                     current_user: User = Depends(
                         get_current_active_user)):
    return create_provider(db=db, provider=provider)


@router.patch("/api/provider/",
              response_model=ProviderResponse,
              tags=["Provider"])
def update_providers(provider: ProviderResponse,
                     db: Session = Depends(get_db),
                     current_user: User = Depends(
                         get_current_active_user)):
    db_provider = update_provider(db, provider)
    if db_provider is None:
        raise HTTPException(status_code=404, detail="Provider not found")
    return db_provider


@router.delete("/api/provider/",
               response_model=ProviderDelete,
               tags=["Provider"])
def delete_providers(provider: ProviderDelete,
                     db: Session = Depends(get_db),
                     current_user: User = Depends(
                         get_current_active_user)):
    db_provider = delete_provider(db, provider)
    if db_provider is None:
        raise HTTPException(status_code=404, detail="Provider not found")
    return db_provider


@router.get("/api/provider/{provider_id}", response_model=ProviderResponse, tags=["Provider"])
def get_a_provider(provider_id: int, db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_active_user)):
    db_provider = get_provider(db, provider_id=provider_id)
    if db_provider is None:
        raise HTTPException(status_code=404, detail="Provider not found")
    return db_provider


@router.post("/api/provider/quickcreate", response_model=ProviderQuickUpdate,
             tags=["Provider"])
def quick_create_providers(provider: ProviderQuickCreate,
                           db: Session = Depends(get_db),
                           current_user: User = Depends(
                               get_current_active_user)):
    return quick_create_provider(db=db, provider=provider)


@router.patch("/api/provider/quickupdate", response_model=ProviderQuickUpdate,
              tags=["Provider"])
def quick_update_providers(provider: ProviderQuickUpdate,
                           db: Session = Depends(get_db),
                           current_user: User = Depends(
                               get_current_active_user)):
    db_provider = quick_update_provider(db, provider)
    if db_provider is None:
        raise HTTPException(status_code=404, detail="Provider not found")
    return db_provider
