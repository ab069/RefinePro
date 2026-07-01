import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import enum


class UnitType(str, enum.Enum):
    atmospheric_distillation = "atmospheric_distillation"
    vacuum_distillation = "vacuum_distillation"
    catalytic_cracker = "catalytic_cracker"
    hydrocracker = "hydrocracker"
    reformer = "reformer"
    alkylation = "alkylation"
    coker = "coker"
    hydrotreater = "hydrotreater"


class UnitStatus(str, enum.Enum):
    online = "online"
    offline = "offline"
    maintenance = "maintenance"
    startup = "startup"


class RefineryUnit(Base):
    __tablename__ = "refinery_units"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    unit_name: Mapped[str] = mapped_column(String(255), nullable=False)
    unit_type: Mapped[UnitType] = mapped_column(SAEnum(UnitType), nullable=False)
    status: Mapped[UnitStatus] = mapped_column(SAEnum(UnitStatus), default=UnitStatus.online)
    temperature: Mapped[float] = mapped_column(Float, default=0.0)
    pressure: Mapped[float] = mapped_column(Float, default=0.0)
    feed_rate: Mapped[float] = mapped_column(Float, default=0.0)
    product_yield: Mapped[float] = mapped_column(Float, default=0.0)
    efficiency: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="units")
    alerts = relationship("Alert", back_populates="unit", cascade="all, delete-orphan")
