from sqlalchemy.orm import Session
from ..models import Client as ClientModel
from ..schemas.client import Client as ClientSchema, ClientQuickCreate
from ..schemas.client import ClientDelete
from ..schemas.client import ClientQuickUpdate


def get_clients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ClientModel).offset(skip).limit(limit).all()


def get_client(db: Session, client_id: int):
    return db.query(ClientModel).filter(
        ClientModel.id == client_id).first()


def create_client(db: Session, client: ClientSchema):
    db_client = ClientModel(name=client.name,
                            phone=client.phone,
                            date=client.date,                            
                            email=client.email,
                            website=client.website,
                            address=client.address,
                            city=client.city,
                            state=client.state,
                            zip_code=client.zip_code,
                            cuit=client.cuit,
                            )
    db.add(db_client)
    db.commit()
    return db_client


def update_client(db: Session, client: ClientSchema):
    client_data = db.query(ClientModel).filter(
        ClientModel.id == client.id).first()
    client_data.name = client.name
    client_data.phone = client.phone
    client_data.date = client.date    
    client_data.email = client.email
    client_data.website = client.website
    client_data.address = client.address
    client_data.city = client.city
    client_data.state = client.state
    client_data.zip_code = client.zip_code
    client_data.cuit = client.cuit
    db.commit()
    db.refresh(client_data)
    return client_data


def delete_client(db: Session, client: ClientDelete):
    client_data = db.query(ClientModel).filter(
        ClientModel.id == client.id).first()
    if client_data is None:
        return None
    else:
        db.delete(client_data)
        db.commit()
        return client_data


def quick_create_client(db: Session, client: ClientQuickCreate):
    db_client = ClientModel(name=client.name,
                            phone=client.phone)
    db.add(db_client)
    db.commit()
    return db_client


def quick_update_client(db: Session, client: ClientQuickUpdate):
    client_data = db.query(ClientModel).filter(
        ClientModel.id == client.id).first()
    client_data.name = client.name
    client_data.phone = client.phone
    db.commit()
    db.refresh(client_data)
    return client_data
