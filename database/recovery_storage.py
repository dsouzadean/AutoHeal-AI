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


def save_recovery(problem, action, status):

    session = SessionLocal()

    recovery = RecoveryLog(
        problem=problem,
        action=action,
        status=status
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
            "status": row.status

        })

    session.close()

    return result