from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.alert import Alert
from app.schemas.alert import AlertResponse


async def get_alerts(db: AsyncSession, user_id: str) -> list[AlertResponse]:
    result = await db.execute(
        select(Alert).where(Alert.user_id == user_id).order_by(Alert.created_at.desc())
    )
    return [_to_response(a) for a in result.scalars().all()]


async def update_alert_status(db: AsyncSession, alert_id: str, user_id: str, status: str) -> AlertResponse:
    result = await db.execute(
        select(Alert).where(Alert.id == alert_id, Alert.user_id == user_id)
    )
    a = result.scalar_one_or_none()
    if not a:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")
    a.status = status
    await db.commit()
    await db.refresh(a)
    return _to_response(a)


async def get_alert_stats(db: AsyncSession, user_id: str) -> dict:
    result = await db.execute(select(Alert).where(Alert.user_id == user_id))
    alerts = result.scalars().all()
    total = len(alerts)
    active = sum(1 for a in alerts if a.status == "active")
    return {"total": total, "active": active}


def _to_response(a: Alert) -> AlertResponse:
    return AlertResponse(
        id=str(a.id),
        user_id=str(a.user_id),
        pipeline_id=str(a.pipeline_id),
        title=a.title,
        alert_type=a.alert_type,
        severity=a.severity,
        status=a.status,
        description=a.description,
        created_at=a.created_at.isoformat() if a.created_at else None,
    )
