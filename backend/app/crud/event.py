from sqlalchemy.orm import Session
from ..models import Event as EventModel
from ..schemas.event import Event as EventSchema
from ..schemas.event import EventDelete, EventUpdate


def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(EventModel).offset(skip).limit(limit).all()


def get_event(db: Session, event_id: int):
    return db.query(EventModel).filter(
        EventModel.id == event_id).first()


def create_event(db: Session, event: EventSchema):
    db_event = EventModel(start=event.start,
                          end=event.end,
                          contact_id=event.contact_id,
                          profesional_id=event.profesional_id,
                          speciality_id=event.speciality_id
                          )
    db.add(db_event)
    db.commit()
    return db_event


def update_event(db: Session, event: EventUpdate):
    event_data = db.query(EventModel).filter(
        EventModel.id == event.id).first()
    event_data.start = event.start
    event_data.end = event.end
    event_data.contact_id = event.contact_id
    event_data.profesional_id = event.profesional_id
    event_data.speciality_id = event.speciality_id
    
    db.commit()
    db.refresh(event_data)
    return event_data


def delete_event(db: Session, event: EventDelete):
    event_data = db.query(EventModel).filter(
        EventModel.id == event.id).first()
    if event_data is None:
        return None
    else:
        db.delete(event_data)
        db.commit()
        return event_data
