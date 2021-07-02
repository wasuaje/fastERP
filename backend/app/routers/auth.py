
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db
from ..dependencies import ACCESS_TOKEN_EXPIRE_MINUTES
from ..dependencies import authenticate_user, create_access_token
from ..schemas.auth import User, UserDetailUpdate, Token
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from ..crud.auth import get_users, get_user, update_user


router = APIRouter()


#
# Usuario - User
#
@router.get("/api/user/", response_model=List[User], tags=["Auth"])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
               current_user: User = Depends(get_current_active_user)):
    cash = get_users(db, skip=skip, limit=limit)
    return cash


@router.get("/api/user/{user_id}", response_model=User, tags=["Auth"])
def read_user(user_id: int, db: Session = Depends(get_db),
              current_user: User = Depends(get_current_active_user)):
    db_user = get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.patch("/api/user/", response_model=User, tags=["Auth"])
def update_users(user: UserDetailUpdate,
                 db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_active_user)):
    db_user = update_user(db, user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.post("/token", response_model=Token, tags=["Auth"])
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/api/users/me/", response_model=User, tags=["Auth"])
async def read_users_me(
        current_user: User = Depends(get_current_active_user)):
    return current_user
