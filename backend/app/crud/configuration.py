from sqlalchemy.orm import Session
from ..models import Configuration as ConfigurationModel
from ..schemas.configuration import Configuration as ConfigurationSchema, ConfigurationQuickCreate
from ..schemas.configuration import ConfigurationQuickUpdate, ConfigurationDelete


def get_configurations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ConfigurationModel).offset(skip).limit(limit).all()


def get_configuration(db: Session, configuration_id: int):
    return db.query(ConfigurationModel).filter(
        ConfigurationModel.id == configuration_id).first()


def create_configuration(db: Session, configuration: ConfigurationSchema):
    db_configuration = ConfigurationModel(config_name=configuration.config_name,
                                          config_value=configuration.config_value
                              )
    db.add(db_configuration)
    db.commit()
    return db_configuration


def update_configuration(db: Session, configuration: ConfigurationQuickUpdate):
    configuration_data = db.query(ConfigurationModel).filter(
        ConfigurationModel.id == configuration.id).first()
    configuration_data.config_name = configuration.config_name    
    configuration_data.config_name = configuration.config_value    

    db.commit()
    db.refresh(configuration_data)
    return configuration_data


def delete_configuration(db: Session, configuration: ConfigurationDelete):
    configuration_data = db.query(ConfigurationModel).filter(
        ConfigurationModel.id == configuration.id).first()
    if configuration_data is None:
        return None
    else:
        db.delete(configuration_data)
        db.commit()
        return configuration_data
