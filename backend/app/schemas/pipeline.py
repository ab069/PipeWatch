from pydantic import BaseModel
from typing import Optional


class PipelineCreate(BaseModel):
    name: str
    material: str
    length_km: float
    diameter_mm: float
    max_pressure: float


class PipelineResponse(BaseModel):
    id: str
    user_id: str
    name: str
    material: str
    length_km: float
    diameter_mm: float
    max_pressure: float
    current_pressure: float
    flow_rate: float
    status: str
    leak_status: str
    integrity_score: int
    created_at: Optional[str] = None

    class Config:
        from_attributes = True
