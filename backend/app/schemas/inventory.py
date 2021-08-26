from typing import List, Optional
import datetime
from pydantic import BaseModel
from .auth import User
from .inventory_detail import InventoryDetailResponse

#
# CASH
#


class InventoryDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "id": 99
        }


class InventoryBase(BaseModel):
    date: datetime.date    
    description: str 
    status: Optional[str] = 0
    user: Optional[User]    
    created_on: Optional[datetime.datetime] = datetime.datetime.now()


class InventoryCreate(InventoryBase):
    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05",                     
                        "description": "Apertura"                        
                        }

class InventoryUpdate(InventoryBase):
    id: int
    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05",                        
                        "description": "Apertura"
                        }

class InventoryResponse(InventoryBase):
    id: int
    inventory_detail: List[Optional[InventoryDetailResponse]]
    class Config:
        orm_mode = True
        schema_extra = {"date": "2019-12-05T00:00:00",                        
                        "description": "Apertura",
                        "user": "Usuario"
                        }
