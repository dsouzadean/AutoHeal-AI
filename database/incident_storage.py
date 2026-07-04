"""
Incident Storage
"""

from database.database import SessionLocal
from database.models import Incident


def save_incident(
    prediction,
    confidence,
    root_cause,
    action,
    status
):
    """
    Save a detected incident.
    """

    session = SessionLocal()

    try:

        incident = Incident(

            prediction=prediction,

            confidence=confidence,

            root_cause=root_cause,

            action=action,

            status=status

        )
        
        print("Saving incident:", prediction, root_cause)

        session.add(incident)

        session.commit()

    except Exception:

        session.rollback()
        raise

    finally:

        session.close()


def get_incidents(limit=20):
    """
    Return latest incidents.
    """

    session = SessionLocal()

    try:

        rows = (
            session.query(Incident)
            .order_by(Incident.id.desc())
            .limit(limit)
            .all()
        )

        result = []

        for row in rows:

            result.append({

                "time": row.timestamp.strftime(
                    "%d %b %Y %I:%M:%S %p"
                ),

                "prediction": row.prediction,

                "confidence": row.confidence,

                "root_cause": row.root_cause,

                "action": row.action,

                "status": row.status

            })

        return result

    finally:

        session.close()