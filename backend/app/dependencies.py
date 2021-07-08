from typing import List, Optional
from datetime import datetime, timedelta
from .database import SessionLocal, engine
from passlib.context import CryptContext
from sqlalchemy.orm import Session, scoped_session
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from .schemas.auth import UserInDB, TokenData, User
from .schemas.permission import Permission
from .crud.auth import get_usernames
from .crud.permission import get_permission
from starlette.requests import Request
import os

SECRET_KEY = os.getenv("FASTAPI_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 180

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain_password, hashed_password):
    # print(get_password_hash(plain_password))
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_username(username: str, db: scoped_session = next(get_db())):
    user = get_usernames(db, username)    
    return UserInDB(**user.__dict__)


def authenticate_user(username: str, password: str):
    user = get_username(username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_username(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


def search_user_permissions(user: User, path, db: scoped_session = next(get_db())):
    return get_permission(db, user.id, path)


async def get_user_permissions(request: Request,
                               current_user: User = Depends(get_current_user),
                               ):    
    # whether we have /api/path/params or not
    # if not we are requesting listing
    if len(request.path_params) > 0:
        current_method = "can_{request.method.lower}"
    else:
        current_method = "can_list"
    current_path = request.url.path.replace("/api/", "")

    current_permission = search_user_permissions(current_user, current_path)
    # This block: if user is superuser, skip permissions    
    if not current_user.is_superuser:
        if len(current_permission) == 0:
            raise HTTPException(status_code=401,
                                detail="User does not have enough permissions")    
        # we validate if current path exists in DB search result    
        has_permission = current_permission.get(current_method, False)
        if not has_permission:
            raise HTTPException(status_code=401,
                                detail="User does not have enough permission to this operation")
    else:
        current_permission = True
    return current_permission


async def get_current_active_user(
        current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
