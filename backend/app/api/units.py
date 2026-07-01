from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.unit import UnitCreate, UnitUpdate, UnitResponse, UnitStats
from app.services import unit_service

router = APIRouter(prefix="/api/units", tags=["units"])


@router.get("/stats", response_model=UnitStats)
async def get_stats(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await unit_service.get_stats(db, user.id)


@router.get("", response_model=list[UnitResponse])
async def list_units(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await unit_service.get_units(db, user.id)


@router.post("", response_model=UnitResponse, status_code=201)
async def create_unit(data: UnitCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await unit_service.create_unit(db, user.id, data)


@router.put("/{unit_id}", response_model=UnitResponse)
async def update_unit(unit_id: str, data: UnitUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    unit = await unit_service.update_unit(db, unit_id, user.id, data)
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    return unit


@router.delete("/{unit_id}", status_code=204)
async def delete_unit(unit_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    deleted = await unit_service.delete_unit(db, unit_id, user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Unit not found")
