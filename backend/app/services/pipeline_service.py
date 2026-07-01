from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.pipeline import Pipeline
from app.schemas.pipeline import PipelineCreate, PipelineResponse


async def create_pipeline(db: AsyncSession, user_id: str, data: PipelineCreate) -> PipelineResponse:
    pipeline = Pipeline(user_id=user_id, **data.model_dump())
    db.add(pipeline)
    await db.commit()
    await db.refresh(pipeline)
    return _to_response(pipeline)


async def get_pipelines(db: AsyncSession, user_id: str) -> list[PipelineResponse]:
    result = await db.execute(
        select(Pipeline).where(Pipeline.user_id == user_id).order_by(Pipeline.created_at.desc())
    )
    return [_to_response(p) for p in result.scalars().all()]


async def get_pipeline(db: AsyncSession, pipeline_id: str, user_id: str) -> PipelineResponse:
    result = await db.execute(
        select(Pipeline).where(Pipeline.id == pipeline_id, Pipeline.user_id == user_id)
    )
    p = result.scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pipeline not found")
    return _to_response(p)


async def delete_pipeline(db: AsyncSession, pipeline_id: str, user_id: str):
    result = await db.execute(
        select(Pipeline).where(Pipeline.id == pipeline_id, Pipeline.user_id == user_id)
    )
    p = result.scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pipeline not found")
    await db.delete(p)
    await db.commit()


async def get_stats(db: AsyncSession, user_id: str) -> dict:
    result = await db.execute(select(Pipeline).where(Pipeline.user_id == user_id))
    pipelines = result.scalars().all()
    total = len(pipelines)
    at_risk = sum(1 for p in pipelines if p.leak_status != "normal" or p.integrity_score < 70)
    leaks = sum(1 for p in pipelines if p.leak_status == "confirmed")
    avg_integrity = round(sum(p.integrity_score for p in pipelines) / total, 1) if total else 0
    return {"total": total, "at_risk": at_risk, "leaks": leaks, "avg_integrity": avg_integrity}


def _to_response(p: Pipeline) -> PipelineResponse:
    return PipelineResponse(
        id=str(p.id),
        user_id=str(p.user_id),
        name=p.name,
        material=p.material,
        length_km=p.length_km,
        diameter_mm=p.diameter_mm,
        max_pressure=p.max_pressure,
        current_pressure=p.current_pressure,
        flow_rate=p.flow_rate,
        status=p.status,
        leak_status=p.leak_status,
        integrity_score=p.integrity_score,
        created_at=p.created_at.isoformat() if p.created_at else None,
    )
