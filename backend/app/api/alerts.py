from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.alert import AlertResponse, AlertStats
from app.services import alert_service

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("", response_model=list[AlertResponse])
async def list_alerts(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await alert_service.get_alerts(db, user.id)


@router.get("/stats", response_model=AlertStats)
async def get_alert_stats(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await alert_service.get_alert_stats(db, user.id)


@router.patch("/{alert_id}/status", response_model=AlertResponse)
async def update_status(alert_id: str, status: str = Query(...), user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    alert = await alert_service.update_alert_status(db, alert_id, user.id, status)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return AlertResponse(
        id=alert.id,
        user_id=alert.user_id,
        unit_id=alert.unit_id,
        title=alert.title,
        alert_type=alert.alert_type.value if hasattr(alert.alert_type, 'value') else alert.alert_type,
        severity=alert.severity.value if hasattr(alert.severity, 'value') else alert.severity,
        status=alert.status.value if hasattr(alert.status, 'value') else alert.status,
        description=alert.description,
        created_at=alert.created_at,
    )
