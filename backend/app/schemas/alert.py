from pydantic import BaseModel
from datetime import datetime


class AlertResponse(BaseModel):
    id: str
    user_id: str
    unit_id: str
    title: str
    alert_type: str
    severity: str
    status: str
    description: str
    created_at: datetime
    unit_name: str = ""

    model_config = {"from_attributes": True}


class AlertStats(BaseModel):
    total: int
    active: int
    critical: int
