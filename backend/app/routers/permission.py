
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..dependencies import ACCESS_TOKEN_EXPIRE_MINUTES
from ..dependencies import authenticate_user, create_access_token
from ..schemas.permission import Permission as PermissionSchema, PermissionCreate, PermissionDelete
from ..schemas.auth import User
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from ..crud.permission import get_permissions, create_permission, delete_permission


router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])


#
# Permisos - Permission
#

@router.get("/api/permission",
            response_model=List[PermissionSchema],
            tags=["Permission"])
def read_permissions(skip: int = 0, limit: int = 100,
                     db: Session = Depends(get_db)):    
    permission = get_permissions(db, skip=skip, limit=limit)
    return permission

# @router.get("/api/permission", response_model=List[PermissionSchema], tags=["Permission"])
# def read_permissions(request: Request, skip: int = 0, limit: int = 100,
#                      db: Session = Depends(get_db),
#                      current_user: User = Depends(get_current_active_user),
#                      current_perms: PermissionSchema = Depends(get_user_permissions)
#                      ):    
#     permission = get_permissions(db, skip=skip, limit=limit)
#     return permission

@router.post("/api/permission/", response_model=PermissionSchema,
             tags=["Permission"])
def create_permissions(permission: PermissionCreate,
                       db: Session = Depends(get_db)):
    return create_permission(db=db, permission=permission)


@router.delete("/api/permission/",
               response_model=PermissionDelete,
               tags=["Permission"])
def delete_permissions(permission: PermissionDelete,
                 db: Session = Depends(get_db)):
    db_permission = delete_permission(db, permission)
    if db_permission is None:
        raise HTTPException(status_code=404, detail="Permission not found")
    return db_permission

# @router.get("/api/permission{user_id}", response_model=User, tags=["Permission"])
# def read_user(user_id: int, db: Session = Depends(get_db),
#               current_user: User = Depends(get_current_active_user)):
#     db_user = get_user(db, user_id=user_id)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return db_user


# @router.patch("/api/permission", response_model=User, tags=["Permission"])
# def update_users(user: UserDetailUpdate,
#                  db: Session = Depends(get_db),
#                  current_user: User = Depends(get_current_active_user)):
#     db_user = update_user(db, user)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return db_user

