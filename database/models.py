"""
Database Models
"""

from datetime import datetime
from zoneinfo import ZoneInfo

from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime
)

from database.database import Base

# Indian Standard Time
IST = ZoneInfo("Asia/Kolkata")


# ==========================================
# System Metrics
# ==========================================

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


# ==========================================
# Incident History
# ==========================================

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


# ==========================================
# Recovery History
# ==========================================

class RecoveryLog(Base):

    __tablename__ = "recovery_logs"

    id = Column(Integer, primary_key=True)

    timestamp = Column(
        DateTime,
        default=lambda: datetime.now(IST)
    )

    problem = Column(String)

    action = Column(String)

    status = Column(String)

    process = Column(String)

    pid = Column(Integer)

    duration = Column(Float)