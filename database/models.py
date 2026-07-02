"""
Database Models
"""

from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from zoneinfo import ZoneInfo

from database.database import Base

# Indian Standard Time
IST = ZoneInfo("Asia/Kolkata")


class SystemMetrics(Base):

    __tablename__ = "system_metrics"

    id = Column(Integer, primary_key=True)

    timestamp = Column(
        DateTime,
        default=lambda: datetime.now(IST)
    )

    cpu = Column(Float)

    memory = Column(Float)

    disk = Column(Float)

    network_sent = Column(Float)

    network_received = Column(Float)

    processes = Column(Integer)


class Incident(Base):

    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True)

    timestamp = Column(
        DateTime,
        default=lambda: datetime.now(IST)
    )

    prediction = Column(String)

    confidence = Column(Float)

    root_cause = Column(String)

    action = Column(String)

    status = Column(String)