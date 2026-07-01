import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class PumpStation(Base):
    __tablename__ = "pump_stations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    pipeline_id = Column(UUID(as_uuid=True), ForeignKey("pipelines.id"), nullable=False)
    name = Column(String(255), nullable=False)
    location_km = Column(Float, nullable=False)
    status = Column(String(20), nullable=False, default="active")
    discharge_pressure = Column(Float, nullable=False, default=0)
    suction_pressure = Column(Float, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="stations")
    pipeline = relationship("Pipeline", back_populates="stations")
