import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class Pipeline(Base):
    __tablename__ = "pipelines"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    material = Column(String(50), nullable=False)
    length_km = Column(Float, nullable=False)
    diameter_mm = Column(Float, nullable=False)
    max_pressure = Column(Float, nullable=False)
    current_pressure = Column(Float, nullable=False, default=0)
    flow_rate = Column(Float, nullable=False, default=0)
    status = Column(String(20), nullable=False, default="active")
    leak_status = Column(String(20), nullable=False, default="normal")
    integrity_score = Column(Integer, nullable=False, default=100)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="pipelines")
    alerts = relationship("Alert", back_populates="pipeline")
    stations = relationship("PumpStation", back_populates="pipeline")
