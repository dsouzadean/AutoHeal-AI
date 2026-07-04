"""
Recovery Log Storage
"""

from database.database import SessionLocal
from database.models import RecoveryLog


def initialize_recovery_table():
    """
    Table creation is handled automatically by SQLAlchemy Base.metadata.create_all().
    This function exists only to keep app.py compatible.
    """
    pass


def save_recovery(
    problem,
    action,
    status,
    process="Unknown",
    pid=0,
    duration=0.0
):

    session = SessionLocal()

    recovery = RecoveryLog(
        problem=problem,
        action=action,
        status=status,
        process=process,
        pid=pid,
        duration=duration
    )

    session.add(recovery)
    session.commit()
    session.close()


def get_recovery_logs(limit=20):

    session = SessionLocal()

    rows = (
        session.query(RecoveryLog)
        .order_by(RecoveryLog.id.desc())
        .limit(limit)
        .all()
    )

    result = []

    for row in rows:

        result.append({

            "id": row.id,
            "time": row.timestamp.strftime("%d %b %Y %I:%M:%S %p"),

            "problem": row.problem,

            "action": row.action,

            "process": row.process,

            "pid": row.pid,

            "duration": row.duration,

            "status": row.status

        })

    session.close()

    return result