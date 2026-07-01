from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import decode_token
from app.models.unit import RefineryUnit
from app.models.alert import Alert, AlertType, AlertSeverity
from app.agents.refinery_agent import RefineryAgent
from sqlalchemy import select

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, ws: WebSocket):
        await ws.accept()
        self.active_connections[user_id] = ws

    def disconnect(self, user_id: str):
        self.active_connections.pop(user_id, None)

    async def send_personal_message(self, message: dict, user_id: str):
        ws = self.active_connections.get(user_id)
        if ws:
            try:
                await ws.send_json(message)
            except Exception:
                self.disconnect(user_id)


manager = ConnectionManager()


@router.websocket("/ws/process/{unit_id}")
async def process_websocket(ws: WebSocket, unit_id: str, token: str, db: AsyncSession = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        await ws.close(code=4001)
        return
    user_id = payload.get("sub")
    if not user_id:
        await ws.close(code=4001)
        return

    await manager.connect(user_id, ws)
    agent = RefineryAgent()

    try:
        while True:
            data = await ws.receive_json()
            action = data.get("action", "analyze")

            result = await db.execute(
                select(RefineryUnit).where(RefineryUnit.id == unit_id, RefineryUnit.user_id == user_id)
            )
            unit = result.scalar_one_or_none()

            if not unit:
                await manager.send_personal_message({"error": "Unit not found"}, user_id)
                continue

            if action == "analyze":
                health = agent.analyze_unit_health(
                    data.get("temperature", unit.temperature),
                    data.get("pressure", unit.pressure),
                    unit.unit_type.value if hasattr(unit.unit_type, 'value') else unit.unit_type,
                )
                efficiency = agent.calculate_efficiency(
                    data.get("temperature", unit.temperature),
                    data.get("pressure", unit.pressure),
                    data.get("feed_rate", unit.feed_rate),
                    data.get("product_yield", unit.product_yield),
                )
                report = agent.generate_unit_report(unit.unit_name, efficiency, [health["message"]] if not health["healthy"] else [])
                await manager.send_personal_message({
                    "type": "analysis",
                    "unit_id": unit_id,
                    "health": health,
                    "efficiency": efficiency,
                    "report": report,
                }, user_id)

            elif action == "detect_upset":
                temp_trend = data.get("temperature_trend", [])
                press_trend = data.get("pressure_trend", [])
                upset = agent.detect_upset(temp_trend, press_trend)
                await manager.send_personal_message({
                    "type": "upset_detection",
                    "unit_id": unit_id,
                    "upset": upset,
                }, user_id)

                if upset["upset"]:
                    alert = Alert(
                        user_id=user_id,
                        unit_id=unit_id,
                        title=f"Upset detected in {unit.unit_name}",
                        alert_type=AlertType.upset,
                        severity=AlertSeverity.high,
                        description="; ".join(upset["reasons"]),
                    )
                    db.add(alert)
                    await db.commit()

    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception:
        manager.disconnect(user_id)
