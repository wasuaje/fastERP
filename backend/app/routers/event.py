from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..dependencies import get_current_active_user, get_db, get_user_permissions
from ..schemas.event import Event as EventSchema, EventCreate
from ..schemas.event import EventResponse, EventUpdate
from ..schemas.event import EventDelete
from ..schemas.auth import User
from ..crud.event import get_events, create_event, update_event, get_event
from ..crud.event import delete_event

router = APIRouter(dependencies=[Depends(get_current_active_user),
                                 Depends(get_user_permissions)])

#
# Event
#
@router.get("/api/event/", response_model=List[EventResponse],
            tags=["Event"])
def read_events(skip: int = 0, limit: int = 100,
                db: Session = Depends(get_db),
                current_user: User = Depends(
                    get_current_active_user)):
    cash = get_events(db, skip=skip, limit=limit)
    return cash


@router.post("/api/event/", response_model=EventResponse,
             tags=["Event"])
def create_events(event: EventCreate,
                  db: Session = Depends(get_db),
                  current_user: User = Depends(
                      get_current_active_user)):
    return create_event(db=db, event=event)


@router.patch("/api/event/",
              response_model=EventResponse,
              tags=["Event"])
def update_events(event: EventUpdate,
                  db: Session = Depends(get_db),
                  current_user: User = Depends(
                      get_current_active_user)):
    db_event = update_event(db, event)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event


@router.delete("/api/event/",
               response_model=EventDelete,
               tags=["Event"])
def delete_events(event: EventDelete,
                  db: Session = Depends(get_db),
                  current_user: User = Depends(
                      get_current_active_user)):
    db_event = delete_event(db, event)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event


@router.get("/api/event/{event_id}", response_model=EventResponse,
            tags=["Event"])
def get_a_event(event_id: int, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_active_user)):
    db_event = get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event
