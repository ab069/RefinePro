from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from app.models.alert import Alert, AlertStatus
from app.schemas.alert import AlertResponse, AlertStats


async def get_alerts(db: AsyncSession, user_id: str) -> list[AlertResponse]:
    result = await db.execute(
        select(Alert)
        .options(joinedload(Alert.unit))
        .where(Alert.user_id == user_id)
        .order_by(Alert.created_at.desc())
    )
    alerts = result.scalars().unique().all()
    return [
        AlertResponse(
            id=a.id,
            user_id=a.user_id,
            unit_id=a.unit_id,
            title=a.title,
            alert_type=a.alert_type.value if hasattr(a.alert_type, 'value') else a.alert_type,
            severity=a.severity.value if hasattr(a.severity, 'value') else a.severity,
            status=a.status.value if hasattr(a.status, 'value') else a.status,
            description=a.description,
            created_at=a.created_at,
            unit_name=a.unit.unit_name if a.unit else "",
        )
        for a in alerts
    ]


async def update_alert_status(db: AsyncSession, alert_id: str, user_id: str, status: str) -> Alert | None:
    result = await db.execute(
        select(Alert).where(Alert.id == alert_id, Alert.user_id == user_id)
    )
    alert = result.scalar_one_or_none()
    if not alert:
        return None
    alert.status = AlertStatus(status)
    await db.commit()
    await db.refresh(alert)
    return alert


async def get_alert_stats(db: AsyncSession, user_id: str) -> AlertStats:
    result = await db.execute(select(Alert).where(Alert.user_id == user_id))
    alerts = list(result.scalars().all())
    total = len(alerts)
    active = sum(1 for a in alerts if a.status == AlertStatus.active)
    critical = sum(1 for a in alerts if a.severity.value == "critical" or a.severity == "critical")
    return AlertStats(total=total, active=active, critical=critical)
