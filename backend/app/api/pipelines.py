from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.schemas.pipeline import PipelineCreate, PipelineResponse
from app.services import pipeline_service

router = APIRouter(prefix="/api/pipelines", tags=["pipelines"])


@router.get("/stats")
async def get_stats(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await pipeline_service.get_stats(db, user_id)


@router.get("", response_model=list[PipelineResponse])
async def list_pipelines(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await pipeline_service.get_pipelines(db, user_id)


@router.post("", response_model=PipelineResponse)
async def create_pipeline(
    data: PipelineCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await pipeline_service.create_pipeline(db, user_id, data)


@router.get("/{pipeline_id}", response_model=PipelineResponse)
async def get_pipeline(
    pipeline_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await pipeline_service.get_pipeline(db, pipeline_id, user_id)


@router.delete("/{pipeline_id}")
async def delete_pipeline(
    pipeline_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await pipeline_service.delete_pipeline(db, pipeline_id, user_id)
    return {"ok": True}
