from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.profesional import Profesional as ProfesionalSchema, ProfesionalQuickCreate
from ..schemas.profesional import ProfesionalQuickUpdate, ProfesionalResponse
from ..schemas.profesional import ProfesionalDelete
from ..schemas.auth import User
from ..crud.profesional import get_profesionals, create_profesional, update_profesional, get_profesional
from ..crud.profesional import quick_create_profesional, quick_update_profesional
from ..crud.profesional import delete_profesional

router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Profesional
#
@router.get("/api/profesional/", response_model=List[ProfesionalResponse],
            tags=["Profesional"])
def read_profesionals(skip: int = 0, limit: int = 100,
                      db: Session = Depends(get_db),
                      current_user: User = Depends(
                          get_current_active_user)):
    cash = get_profesionals(db, skip=skip, limit=limit)
    return cash


@router.post("/api/profesional/", response_model=ProfesionalResponse,
             tags=["Profesional"])
def create_profesionals(profesional: ProfesionalSchema,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(
                            get_current_active_user)):
    return create_profesional(db=db, profesional=profesional)


@router.patch("/api/profesional/",
              response_model=ProfesionalResponse,
              tags=["Profesional"])
def update_profesionals(profesional: ProfesionalResponse,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(
                            get_current_active_user)):
    db_profesional = update_profesional(db, profesional)
    if db_profesional is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_profesional


@router.delete("/api/profesional/",
               response_model=ProfesionalDelete,
               tags=["Profesional"])
def delete_profesionals(profesional: ProfesionalDelete,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(
                            get_current_active_user)):
    db_profesional = delete_profesional(db, profesional)
    if db_profesional is None:
        raise HTTPException(status_code=404, detail="Profesional not found")
    return db_profesional


@router.get("/api/profesional/{profesional_id}", response_model=ProfesionalResponse, tags=["Profesional"])
def get_a_profesional(profesional_id: int, db: Session = Depends(get_db),
                      current_user: User = Depends(get_current_active_user)):
    db_profesional = get_profesional(db, profesional_id=profesional_id)
    if db_profesional is None:
        raise HTTPException(status_code=404, detail="Profesional not found")
    return db_profesional


@router.post("/api/profesional/quickcreate", response_model=ProfesionalQuickUpdate,
             tags=["Profesional"])
def quick_create_profesionals(profesional: ProfesionalQuickCreate,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    return quick_create_profesional(db=db, profesional=profesional)


@router.patch("/api/profesional/quickupdate", response_model=ProfesionalQuickUpdate,
              tags=["Profesional"])
def quick_update_profesionals(profesional: ProfesionalQuickUpdate,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    db_profesional = quick_update_profesional(db, profesional)
    if db_profesional is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_profesional
