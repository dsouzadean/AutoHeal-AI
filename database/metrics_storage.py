"""
Metrics Storage
"""

from database.database import SessionLocal
from database.models import SystemMetrics


def save_metrics(data):
    """
    Save a system metrics snapshot.
    """

    session = SessionLocal()

    try:

        metric = SystemMetrics(

            cpu=float(data.get("cpu", 0)),

            memory=float(data.get("memory", 0)),

            disk=float(data.get("disk", 0)),

            network_sent=float(data.get("network_sent", 0)),

            network_received=float(data.get("network_received", 0)),

            processes=int(data.get("processes", 0))

        )

        session.add(metric)

        session.commit()

    except Exception:

        session.rollback()
        raise

    finally:

        session.close()


def get_metrics(limit=20):
    """
    Return latest metrics.
    """

    session = SessionLocal()

    try:

        rows = (
            session.query(SystemMetrics)
            .order_by(SystemMetrics.id.desc())
            .limit(limit)
            .all()
        )

        result = []

        for row in rows:

            result.append({

                "time": row.timestamp.strftime(
                    "%d %b %Y %I:%M:%S %p"
                ),

                "cpu": row.cpu,

                "memory": row.memory,

                "disk": row.disk,

                "network_sent": row.network_sent,

                "network_received": row.network_received,

                "processes": row.processes

            })

        return result

    finally:

        session.close()


# ==========================================
# Forecast Engine Support
# ==========================================

def load_metrics_history(limit=20):
    """
    Returns recent metrics for AI forecasting.
    """

    session = SessionLocal()

    try:

        rows = (
            session.query(SystemMetrics)
            .order_by(SystemMetrics.id.desc())
            .limit(limit)
            .all()
        )

        history = []

        for row in rows:

            history.append({

                "cpu": row.cpu,

                "memory": row.memory,

                "disk": row.disk,

                "network_sent": row.network_sent,

                "network_received": row.network_received,

                "processes": row.processes,

                "timestamp": row.timestamp

            })

        return history

    finally:

        session.close()