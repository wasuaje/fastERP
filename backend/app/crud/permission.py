from sqlalchemy.orm import Session
from ..models import UserPermission as PermissionModel
from ..schemas.permission import Permission as PermissionSchema, PermissionDelete 
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# PERMISSION
def get_permissions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(PermissionModel).offset(skip).limit(limit).all()


def get_permission(db: Session, user_id: int, path: str):
    return db.query(PermissionModel).filter(
        PermissionModel.user_id == user_id,
        PermissionModel.path == path).all()


def create_permission(db: Session, permission: PermissionSchema):
    db_permission = PermissionModel(path=permission.path,
                                    can_list=permission.can_list,
                                    can_get=permission.can_get,
                                    can_post=permission.can_post,
                                    can_patch=permission.can_patch,
                                    can_delete=permission.can_delete,
                                    user_id=permission.user_id
                                    )
    db.add(db_permission)
    db.commit()
    return db_permission


def delete_permission(db: Session, permission: PermissionDelete):
    permission_data = db.query(PermissionModel).filter(
        PermissionModel.id == permission.id).first()
    if permission_data is None:
        return None
    else:
        db.delete(permission_data)
        db.commit()
        return permission_data

     
# def get_user(db: Session, user_id: int):
#     return db.query(PermissionModel).filter(PermissionModel.id == user_id).first()


# def update_user(db: Session, user: UserDetailUpdate):
#     stored_user_data = db.query(PermissionModel).filter(
#         PermissionModel.id == user.id).first()
#     stored_user_data.username = user.username
#     stored_user_data.email = user.email
#     stored_user_data.first_name = user.first_name
#     stored_user_data.last_name = user.last_name
#     stored_user_data.is_active = user.is_active
#     stored_user_data.is_staff = user.is_staff
#     stored_user_data.password = pwd_context.hash(user.password)
#     db.commit()
#     db.refresh(stored_user_data)
#     return stored_user_data


# def get_usernames(db: Session, username: str):
#     return db.query(PermissionModel).filter(
#         PermissionModel.username == username).first()
