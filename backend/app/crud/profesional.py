from sqlalchemy.orm import Session
from ..models import Employee as ProfesionalModel
from ..schemas.profesional import Profesional as ProfesionalSchema, ProfesionalQuickCreate
from ..schemas.profesional import ProfesionalQuickUpdate, ProfesionalDelete


def get_profesionals(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ProfesionalModel).offset(skip).limit(limit).all()


def get_profesional(db: Session, profesional_id: int):
    return db.query(ProfesionalModel).filter(
        ProfesionalModel.id == profesional_id).first()


def create_profesional(db: Session, profesional: ProfesionalSchema):
    db_profesional = ProfesionalModel(name=profesional.name,
                                      gender=profesional.gender,
                                      email=profesional.email,
                                      phone=profesional.phone
                                      )
    db.add(db_profesional)
    db.commit()
    return db_profesional


def update_profesional(db: Session, profesional: ProfesionalSchema):
    profesional_data = db.query(ProfesionalModel).filter(
        ProfesionalModel.id == profesional.id).first()
    profesional_data.name = profesional.name
    profesional_data.phone = profesional.phone
    profesional_data.gender = profesional.gender
    profesional_data.email = profesional.email
    db.commit()
    db.refresh(profesional_data)
    return profesional_data


def delete_profesional(db: Session, profesional: ProfesionalDelete):
    profesional_data = db.query(ProfesionalModel).filter(
        ProfesionalModel.id == profesional.id).first()
    if profesional_data is None:
        return None
    else:
        db.delete(profesional_data)
        db.commit()
        return profesional_data


def quick_create_profesional(db: Session, profesional: ProfesionalQuickCreate):
    db_profesional = ProfesionalModel(name=profesional.name,
                                      phone=profesional.phone
                                      )
    db.add(db_profesional)
    db.commit()
    return db_profesional


def quick_update_profesional(db: Session, profesional: ProfesionalQuickUpdate):
    profesional_data = db.query(ProfesionalModel).filter(
        ProfesionalModel.id == profesional.id).first()
    profesional_data.name = profesional.name
    profesional_data.phone = profesional.phone
    db.commit()
    db.refresh(profesional_data)
    return profesional_data
