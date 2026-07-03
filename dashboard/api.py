"""
Dashboard API
"""

from flask import Blueprint, jsonify

from database.database import SessionLocal
from database.models import SystemMetrics, RecoveryLog

api = Blueprint("api", __name__)


@api.route("/history")
def history():

    session = SessionLocal()

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

    session.close()

    return jsonify(result)


@api.route("/api/recovery-history")
def recovery_history():

    session = SessionLocal()

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
            "status": row.status
        })

    session.close()

    return jsonify(result)