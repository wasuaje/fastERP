from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.collect import Collect, CollectCreate, CollectDelete, CollectResponse
from ..schemas.auth import User
from ..crud.collect import get_collects, create_collect
from ..crud.collect import get_collect, delete_collect, update_collect
# from fastapi_pagination import paginate, Page


router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Facturacion - Collect
#
@router.get("/api/collect/", response_model=List[CollectResponse], tags=["Collect"])
def list_collect(skip: int = 0, limit: int = 100,
                 db: Session = Depends(get_db)):
    collect = get_collects(db, skip=skip, limit=limit)
    return collect
    # return paginate(collect)



@router.post("/api/collect/", response_model=Collect, tags=["Collect"])
def create_a_collect(collect: CollectCreate,
                     db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_active_user)):
    return create_collect(db=db, collect=collect)


@router.get("/api/collect/{collect_id}", response_model=CollectResponse,
            tags=["Collect"])
def get_a_collect(collect_id: int, db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_active_user)):
    db_collect = get_collect(db, collect_id=collect_id)
    if db_collect is None:
        raise HTTPException(status_code=404, detail="Collect not found")
    return db_collect


@router.patch("/api/collect", response_model=Collect,
              tags=["Collect"])
def update_collects(collect: Collect,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(
                        get_current_active_user)):
    db_client = update_collect(db, collect)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Collect not found")
    return db_client


@router.delete("/api/collect/",
               response_model=CollectDelete,
               tags=["Collect"])
def delete_a_collect(collect: CollectDelete,
                     db: Session = Depends(get_db),
                     current_user: User = Depends(
                         get_current_active_user)):
    db_collect = delete_collect(db, collect)
    if db_collect is None:
        raise HTTPException(status_code=404, detail="Collect not found")
    return db_collect
