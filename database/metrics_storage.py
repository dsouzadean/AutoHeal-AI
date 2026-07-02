"""
Store collected metrics into the database.
"""

from database.database import SessionLocal
from database.models import SystemMetrics


def save_metrics(data):
    session = SessionLocal()

    metric = SystemMetrics(
        cpu=data["cpu"],
        memory=data["memory"],
        disk=data["disk"],
        network_sent=data["network_sent"],
        network_received=data["network_received"],
        processes=data["processes"]
    )

    session.add(metric)
    session.commit()
    session.close()