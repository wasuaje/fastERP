from sqlalchemy.orm import Session
from ..models import User as UserModel
from ..schemas.auth import User, UserDetailUpdate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# USERS
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserModel).offset(skip).limit(limit).all()


def get_user(db: Session, user_id: int):
    return db.query(UserModel).filter(UserModel.id == user_id).first()


def update_user(db: Session, user: UserDetailUpdate):
    stored_user_data = db.query(UserModel).filter(
        UserModel.id == user.id).first()
    stored_user_data.username = user.username
    stored_user_data.email = user.email
    stored_user_data.first_name = user.first_name
    stored_user_data.last_name = user.last_name
    stored_user_data.is_active = user.is_active
    stored_user_data.is_staff = user.is_staff
    stored_user_data.password = pwd_context.hash(user.password)
    db.commit()
    db.refresh(stored_user_data)
    return stored_user_data


def get_usernames(db: Session, username: str):
    return db.query(UserModel).filter(
        UserModel.username == username).first()
