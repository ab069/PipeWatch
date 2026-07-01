from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.schemas.alert import AlertResponse
from app.services import alert_service

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("/stats")
async def get_stats(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await alert_service.get_alert_stats(db, user_id)


@router.get("", response_model=list[AlertResponse])
async def list_alerts(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await alert_service.get_alerts(db, user_id)


@router.patch("/{alert_id}/status", response_model=AlertResponse)
async def update_status(
    alert_id: str,
    status: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await alert_service.update_alert_status(db, alert_id, user_id, status)
