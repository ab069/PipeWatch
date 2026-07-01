from pydantic import BaseModel
from typing import Optional


class AlertResponse(BaseModel):
    id: str
    user_id: str
    pipeline_id: str
    title: str
    alert_type: str
    severity: str
    status: str
    description: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True
