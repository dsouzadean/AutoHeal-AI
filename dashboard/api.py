"""
Dashboard API
"""
from database.incident_storage import get_incidents
from flask import Blueprint, jsonify

from database.database import SessionLocal
from database.models import SystemMetrics, RecoveryLog

api = Blueprint("api", __name__)


# ==========================================
# Metrics History
# ==========================================

@api.route("/history")
def history():

    session = SessionLocal()

    try:

        rows = (
            session.query(SystemMetrics)
            .order_by(SystemMetrics.id.desc())
            .limit(20)
            .all()
        )

        result = []

        for row in rows:

            result.append({

                "time": row.timestamp.strftime("%d %b %Y %I:%M:%S %p"),

                "cpu": row.cpu,

                "memory": row.memory,

                "disk": row.disk,

                "processes": row.processes

            })

        return jsonify(result)

    finally:

        session.close()


# ==========================================
# Recovery History
# ==========================================

@api.route("/api/recovery-history")
def recovery_history():

    session = SessionLocal()

    try:

        rows = (
            session.query(RecoveryLog)
            .order_by(RecoveryLog.id.desc())
            .limit(20)
            .all()
        )

        result = []

        for row in rows:

            result.append({

                "time": row.timestamp.strftime("%d %b %Y %I:%M:%S %p"),

                "problem": row.problem,

                "action": row.action,

                "process": getattr(row, "process", "Unknown"),

                "pid": getattr(row, "pid", 0),

                "duration": getattr(row, "duration", 0),

                "status": row.status

            })

        return jsonify(result)

    finally:

        session.close()
        # ==========================================
# Incident History
# ==========================================

@api.route("/api/incidents")
def incidents():

    return jsonify(get_incidents())

# ==========================================
# Dashboard Statistics
# ==========================================

@api.route("/api/dashboard-stats")
def dashboard_stats():

    session = SessionLocal()

    try:

        total_recoveries = session.query(RecoveryLog).count()

        successful_recoveries = (
            session.query(RecoveryLog)
            .filter(RecoveryLog.status == "Success")
            .count()
        )

        failed_recoveries = total_recoveries - successful_recoveries

        total_incidents = len(get_incidents())

        return jsonify({
            "total_incidents": total_incidents,
            "total_recoveries": total_recoveries,
            "successful_recoveries": successful_recoveries,
            "failed_recoveries": failed_recoveries
        })

    finally:

        session.close()