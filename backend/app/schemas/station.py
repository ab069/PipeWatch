from pydantic import BaseModel
from typing import Optional


class StationResponse(BaseModel):
    id: str
    user_id: str
    pipeline_id: str
    name: str
    location_km: float
    status: str
    discharge_pressure: float
    suction_pressure: float
    created_at: Optional[str] = None

    class Config:
        from_attributes = True
