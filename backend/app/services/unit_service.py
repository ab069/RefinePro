from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.unit import RefineryUnit, UnitStatus
from app.models.alert import Alert, AlertType, AlertSeverity, AlertStatus
from app.schemas.unit import UnitCreate, UnitUpdate, UnitResponse, UnitStats
from app.agents.refinery_agent import RefineryAgent


async def create_unit(db: AsyncSession, user_id: str, data: UnitCreate) -> RefineryUnit:
    agent = RefineryAgent()
    health = agent.analyze_unit_health(data.temperature, data.pressure, data.unit_type)
    efficiency = agent.calculate_efficiency(data.temperature, data.pressure, data.feed_rate, data.product_yield)

    unit = RefineryUnit(
        user_id=user_id,
        unit_name=data.unit_name,
        unit_type=data.unit_type,
        temperature=data.temperature,
        pressure=data.pressure,
        feed_rate=data.feed_rate,
        product_yield=data.product_yield,
        efficiency=efficiency,
    )
    db.add(unit)
    await db.commit()
    await db.refresh(unit)

    if not health["healthy"]:
        alert = Alert(
            user_id=user_id,
            unit_id=unit.id,
            title=f"Unhealthy {data.unit_type}: {health['issue']}",
            alert_type=AlertType.upset,
            severity=AlertSeverity.medium,
            description=health["message"],
        )
        db.add(alert)
        await db.commit()

    return unit


async def get_units(db: AsyncSession, user_id: str) -> list[RefineryUnit]:
    result = await db.execute(
        select(RefineryUnit).where(RefineryUnit.user_id == user_id).order_by(RefineryUnit.created_at.desc())
    )
    return list(result.scalars().all())


async def get_unit(db: AsyncSession, unit_id: str, user_id: str) -> RefineryUnit | None:
    result = await db.execute(
        select(RefineryUnit).where(RefineryUnit.id == unit_id, RefineryUnit.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def update_unit(db: AsyncSession, unit_id: str, user_id: str, data: UnitUpdate) -> RefineryUnit | None:
    unit = await get_unit(db, unit_id, user_id)
    if not unit:
        return None
    if data.unit_name is not None:
        unit.unit_name = data.unit_name
    if data.status is not None:
        unit.status = UnitStatus(data.status)
    if data.temperature is not None:
        unit.temperature = data.temperature
    if data.pressure is not None:
        unit.pressure = data.pressure
    if data.feed_rate is not None:
        unit.feed_rate = data.feed_rate
    if data.product_yield is not None:
        unit.product_yield = data.product_yield

    agent = RefineryAgent()
    unit.efficiency = agent.calculate_efficiency(unit.temperature, unit.pressure, unit.feed_rate, unit.product_yield)
    health = agent.analyze_unit_health(unit.temperature, unit.pressure, unit.unit_type.value if hasattr(unit.unit_type, 'value') else unit.unit_type)

    await db.commit()
    await db.refresh(unit)

    if not health["healthy"]:
        alert = Alert(
            user_id=user_id,
            unit_id=unit.id,
            title=f"Alert: {unit.unit_name} - {health['issue']}",
            alert_type=AlertType.upset,
            severity=AlertSeverity.medium,
            description=health["message"],
        )
        db.add(alert)
        await db.commit()

    return unit


async def delete_unit(db: AsyncSession, unit_id: str, user_id: str) -> bool:
    unit = await get_unit(db, unit_id, user_id)
    if not unit:
        return False
    await db.delete(unit)
    await db.commit()
    return True


async def get_stats(db: AsyncSession, user_id: str) -> UnitStats:
    result = await db.execute(select(RefineryUnit).where(RefineryUnit.user_id == user_id))
    units = list(result.scalars().all())
    total = len(units)
    online = sum(1 for u in units if u.status == UnitStatus.online)
    avg_eff = round(sum(u.efficiency for u in units) / total, 1) if total else 0.0
    total_yield = round(sum(u.product_yield for u in units), 2)
    return UnitStats(total_units=total, online_units=online, avg_efficiency=avg_eff, total_yield=total_yield)
