from sqlalchemy.orm import Session
from ..models import Speciality as SpecialityModel
from ..schemas.speciality import Speciality as SpecialitySchema
from ..schemas.speciality import SpecialityDelete


def get_specialitys(db: Session, skip: int = 0, limit: int = 100):
    return db.query(SpecialityModel).offset(skip).limit(limit).all()


def get_speciality(db: Session, speciality_id: int):
    return db.query(SpecialityModel).filter(
        SpecialityModel.id == speciality_id).first()


def create_speciality(db: Session, speciality: SpecialitySchema):
    db_speciality = SpecialityModel(name=speciality.name)
    db.add(db_speciality)
    db.commit()
    return db_speciality


def update_speciality(db: Session, speciality: SpecialitySchema):
    speciality_data = db.query(SpecialityModel).filter(
        SpecialityModel.id == speciality.id).first()
    speciality_data.name = speciality.name

    db.commit()
    db.refresh(speciality_data)
    return speciality_data


def delete_speciality(db: Session, speciality: SpecialityDelete):
    speciality_data = db.query(SpecialityModel).filter(
        SpecialityModel.id == speciality.id).first()
    if speciality_data is None:
        return None
    else:
        db.delete(speciality_data)
        db.commit()
        return speciality_data
