from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.collect_detail import CollectDetail, CollectDetailResponse
from ..schemas.collect_detail import CollectDetailDelete, CollectDetailCreate
from ..schemas.auth import User
from ..crud.collect_detail import get_collect_details, create_collect_detail
from ..crud.collect_detail import delete_collect_detail, update_collect_detail
from ..crud.collect_detail import get_collect_detail


router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# CAjaDetalle - CollectDetail
#
@router.get("/api/collect-detail/", response_model=List[CollectDetailResponse],
            tags=["CollectDetail"])
def read_collect_details(skip: int = 0, limit: int = 100,
                         db: Session = Depends(get_db),
                         current_user: User = Depends(
                             get_current_active_user)):
    collect_detail = get_collect_details(db, skip=skip, limit=limit)
    return collect_detail

@router.post("/api/collect-detail/", response_model=CollectDetailCreate,
             tags=["CollectDetail"])
def create_collect_details(collect_detail: CollectDetailCreate,
                           db: Session = Depends(get_db),
                           current_user: User = Depends(
                               get_current_active_user)):

    db_collect = create_collect_detail(db=db, collect_detail=collect_detail)
    
    if db_collect is None:
        raise HTTPException(status_code=409, detail="Be sure there is only/at least one CASH opened")
    
    return db_collect

# not sure if worht thinking about stock
@router.patch("/api/collect-detail/",
              response_model=CollectDetail,
              tags=["CollectDetail"])
def update_collect_details(collect_detail: CollectDetail,
                           db: Session = Depends(get_db),
                           current_user: User = Depends(
                               get_current_active_user)):
    db_collect_detail = update_collect_detail(db, collect_detail)
    if db_collect_detail is None:
        raise HTTPException(status_code=404, detail="CollectDetail not found")
    return db_collect_detail

@router.delete("/api/collect-detail/",
               response_model=CollectDetailDelete,
               tags=["CollectDetail"])
def delete_collect_details(collect_detail: CollectDetailDelete,
                           db: Session = Depends(get_db),
                           current_user: User = Depends(
                               get_current_active_user)):
    db_collect_detail = delete_collect_detail(db, collect_detail)
    if db_collect_detail is None:
        raise HTTPException(status_code=409, detail="Be sure there is only/at least one CASH opened")
    return db_collect_detail


@router.get("/api/collect-detail/{collect_id}", response_model=List[CollectDetailResponse], tags=["CollectDetail"])
def get_a_collect_detail(collect_id: int, db: Session = Depends(get_db),
                         current_user: User = Depends(get_current_active_user)):
    db_collect_detail = get_collect_detail(
        db, collect_id=collect_id)
    if db_collect_detail is None:
        raise HTTPException(status_code=404, detail="CollectDetail not found")
    return db_collect_detail
