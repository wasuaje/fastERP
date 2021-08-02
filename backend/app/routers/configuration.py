from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.configuration import Configuration as ConfigurationSchema, ConfigurationQuickCreate
from ..schemas.configuration import ConfigurationQuickUpdate, ConfigurationResponse
from ..schemas.configuration import ConfigurationDelete
from ..schemas.auth import User
from ..crud.configuration import get_configurations, create_configuration
from ..crud.configuration import update_configuration, get_configuration
from ..crud.configuration import delete_configuration

router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Pay mentMethod
#
@router.get("/api/configuration/", response_model=List[ConfigurationResponse],
            tags=["Configuration"])
def read_configuration(skip: int = 0, limit: int = 100,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(
                                get_current_active_user)):
    cash = get_configurations(db, skip=skip, limit=limit)
    return cash


@router.post("/api/configuration/", response_model=ConfigurationResponse,
             tags=["Configuration"])
def create_configuration(configuration: ConfigurationSchema,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    return create_configuration(db=db, configuration=configuration)


@router.patch("/api/configuration/",
              response_model=ConfigurationResponse,
              tags=["Configuration"])
def update_configuration(configuration: ConfigurationQuickUpdate,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    db_product = update_configuration(db, configuration)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Configuration not found")
    return db_product


@router.delete("/api/configuration/",
               response_model=ConfigurationDelete,
               tags=["Configuration"])
def delete_configuration(configuration: ConfigurationDelete,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(
                                  get_current_active_user)):
    db_product = delete_configuration(db, configuration)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Configuration not found")
    return db_product


@router.get("/api/configuration/{configuration_id}", response_model=ConfigurationResponse, tags=["Configuration"])
def get_a_configuration(configuration_id: int, db: Session = Depends(get_db),
                           current_user: User = Depends(get_current_active_user)):
    db_product = get_configuration(db, configuration_id=configuration_id)
    if db_product is None:
        raise HTTPException(
            status_code=404, detail="Configuration not found")
    return db_product

