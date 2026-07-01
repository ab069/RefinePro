from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UnitCreate(BaseModel):
    unit_name: str
    unit_type: str
    temperature: float = 0.0
    pressure: float = 0.0
    feed_rate: float = 0.0
    product_yield: float = 0.0


class UnitUpdate(BaseModel):
    unit_name: Optional[str] = None
    status: Optional[str] = None
    temperature: Optional[float] = None
    pressure: Optional[float] = None
    feed_rate: Optional[float] = None
    product_yield: Optional[float] = None


class UnitResponse(BaseModel):
    id: str
    user_id: str
    unit_name: str
    unit_type: str
    status: str
    temperature: float
    pressure: float
    feed_rate: float
    product_yield: float
    efficiency: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UnitStats(BaseModel):
    total_units: int
    online_units: int
    avg_efficiency: float
    total_yield: float
