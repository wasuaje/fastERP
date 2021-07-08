from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.speciality import Speciality as SpecialitySchema
from ..schemas.speciality import SpecialityQuickUpdate, SpecialityResponse
from ..schemas.speciality import SpecialityDelete
from ..schemas.auth import User
from ..crud.speciality import get_specialitys, create_speciality, get_speciality
from ..crud.speciality import delete_speciality, update_speciality

router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Speciality
#
@router.get("/api/speciality/", response_model=List[SpecialityResponse],
            tags=["Speciality"])
def read_specialitys(skip: int = 0, limit: int = 100,
                     db: Session = Depends(get_db),
                     current_user: User = Depends(
                         get_current_active_user)):
    cash = get_specialitys(db, skip=skip, limit=limit)
    return cash


@router.post("/api/speciality/", response_model=SpecialityResponse,
             tags=["Speciality"])
def create_specialitys(speciality: SpecialitySchema,
                       db: Session = Depends(get_db),
                       current_user: User = Depends(
                           get_current_active_user)):
    return create_speciality(db=db, speciality=speciality)


@router.patch("/api/speciality/",
              response_model=SpecialityResponse,
              tags=["Speciality"])
def update_specialitys(speciality: SpecialityResponse,
                       db: Session = Depends(get_db),
                       current_user: User = Depends(
                           get_current_active_user)):
    db_speciality = update_speciality(db, speciality)
    if db_speciality is None:
        raise HTTPException(status_code=404, detail="Speciality not found")
    return db_speciality


@router.delete("/api/speciality/",
               response_model=SpecialityDelete,
               tags=["Speciality"])
def delete_specialitys(speciality: SpecialityDelete,
                       db: Session = Depends(get_db),
                       current_user: User = Depends(
                           get_current_active_user)):
    db_speciality = delete_speciality(db, speciality)
    if db_speciality is None:
        raise HTTPException(status_code=404, detail="Speciality not found")
    return db_speciality


@router.get("/api/speciality/{speciality_id}", response_model=SpecialityResponse, tags=["Speciality"])
def get_a_speciality(speciality_id: int, db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_active_user)):
    db_speciality = get_speciality(db, speciality_id=speciality_id)
    if db_speciality is None:
        raise HTTPException(status_code=404, detail="Speciality not found")
    return db_speciality
