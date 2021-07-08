from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.purchase_detail import PurchaseDetail, PurchaseDetailResponse
from ..schemas.purchase_detail import PurchaseDetailDelete, PurchaseDetailCreate
from ..schemas.auth import User
from ..crud.purchase_detail import get_purchase_details, create_purchase_detail
from ..crud.purchase_detail import delete_purchase_detail, update_purchase_detail
from ..crud.purchase_detail import get_purchase_detail


router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# CAjaDetalle - PurchaseDetail
#
@router.get("/api/purchase-detail/", response_model=List[PurchaseDetailResponse],
            tags=["PurchaseDetail"])
def read_purchase_details(skip: int = 0, limit: int = 100,
                          db: Session = Depends(get_db),
                          current_user: User = Depends(
                              get_current_active_user)):
    purchase_detail = get_purchase_details(db, skip=skip, limit=limit)
    return purchase_detail

@router.post("/api/purchase-detail/", response_model=PurchaseDetailResponse,
             tags=["PurchaseDetail"])
def create_purchase_details(purchase_detail: PurchaseDetailCreate,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(
                                get_current_active_user)):
    return create_purchase_detail(db=db, purchase_detail=purchase_detail)

# not sure if worht thinking about stock


@router.patch("/api/purchase-detail/",
              response_model=PurchaseDetail,
              tags=["PurchaseDetail"])
def update_purchase_details(purchase_detail: PurchaseDetail,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(
                                get_current_active_user)):
    db_purchase_detail = update_purchase_detail(db, purchase_detail)
    if db_purchase_detail is None:
        raise HTTPException(status_code=404, detail="PurchaseDetail not found")
    return db_purchase_detail


@router.delete("/api/purchase-detail/",
               response_model=PurchaseDetailDelete,
               tags=["PurchaseDetail"])
def delete_purchase_details(purchase_detail: PurchaseDetailDelete,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(
                                get_current_active_user)):
    db_purchase_detail = delete_purchase_detail(db, purchase_detail)
    if db_purchase_detail is None:
        raise HTTPException(status_code=404, detail="PurchaseDetail not found")
    return db_purchase_detail


@router.get("/api/purchase-detail/{purchase_detail_id}", response_model=PurchaseDetailResponse, tags=["PurchaseDetail"])
def get_a_purchase_detail(purchase_detail_id: int, db: Session = Depends(get_db),
                          current_user: User = Depends(get_current_active_user)):
    db_purchase_detail = get_purchase_detail(
        db, purchase_detail_id=purchase_detail_id)
    if db_purchase_detail is None:
        raise HTTPException(status_code=404, detail="PurchaseDetail not found")
    return db_purchase_detail
