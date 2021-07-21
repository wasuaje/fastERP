from sqlalchemy.orm import Session
from ..models import Provider as ProviderModel
from ..schemas.provider import Provider as ProviderSchema, ProviderQuickCreate
from ..schemas.provider import ProviderDelete
from ..schemas.provider import ProviderQuickUpdate


def get_providers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ProviderModel).offset(skip).limit(limit).all()


def get_provider(db: Session, provider_id: int):
    return db.query(ProviderModel).filter(
        ProviderModel.id == provider_id).first()


def create_provider(db: Session, provider: ProviderSchema):
    db_provider = ProviderModel(name=provider.name,
                                phone=provider.phone,
                                date=provider.date,
                                cuit=provider.cuit,
                                email=provider.email,
                                website=provider.website,
                                address=provider.address,
                                city=provider.city,
                                state=provider.state,
                                zip_code=provider.zip_codes)
    db.add(db_provider)
    db.commit()
    return db_provider


def update_provider(db: Session, provider: ProviderSchema):
    provider_data = db.query(ProviderModel).filter(
        ProviderModel.id == provider.id).first()
    provider_data.name = provider.name
    provider_data.phone = provider.phone
    provider_data.date = provider.date
    provider_data.cuit = provider.cuit
    provider_data.email = provider.email
    provider_data.website = provider.website
    provider_data.address = provider.address
    provider_data.city = provider.city
    provider_data.state = provider.state
    provider_data.zip_code = provider.zip_code
    db.commit()
    db.refresh(provider_data)
    return provider_data


def delete_provider(db: Session, provider: ProviderDelete):
    provider_data = db.query(ProviderModel).filter(
        ProviderModel.id == provider.id).first()
    if provider_data is None:
        return None
    else:
        db.delete(provider_data)
        db.commit()
        return provider_data


def quick_create_provider(db: Session, provider: ProviderQuickCreate):
    db_provider = ProviderModel(name=provider.name,
                                phone=provider.phone)
    db.add(db_provider)
    db.commit()
    return db_provider


def quick_update_provider(db: Session, provider: ProviderQuickUpdate):
    provider_data = db.query(ProviderModel).filter(
        ProviderModel.id == provider.id).first()
    provider_data.name = provider.name
    provider_data.phone = provider.phone
    db.commit()
    db.refresh(provider_data)
    return provider_data
