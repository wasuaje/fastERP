from typing import List, Optional
import datetime
from pydantic import BaseModel


#
# Configuration
#
class ConfigurationBase(BaseModel):
    id: int


class ConfigurationDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class ConfigurationQuickCreate(BaseModel):
    config_name: str
    config_value: str
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "config_name": "company_name",
                "config_value": "My Super COmpany",
            }
        }


class ConfigurationQuickUpdate(ConfigurationBase):
    config_name: str
    config_value: str
    created_on: Optional[datetime.datetime] = datetime.datetime.now()

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 999,
                "config_name": "company_name",
                "config_value": "My Super COmpany",
            }
        }


# Suitable for update full productCategory, and productCategory get
class Configuration(ConfigurationQuickCreate):    

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "config_name": "company_name",
                "config_value": "My Super COmpany",
            }
        }


class ConfigurationResponse(Configuration, ConfigurationQuickCreate):
    id: int

    class Config:
        schema_extra = {
            "example": {
                "config_name": "company_name",
                "config_value": "My Super COmpany",
                       }
        }
