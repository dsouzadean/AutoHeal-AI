"""
Adaptive Recovery Learning Engine
"""

import sqlite3

DATABASE = "autoheal.db"


def get_best_recovery(problem):
    """
    Returns the historically most successful
    recovery action for a given problem.
    """

    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute("""

        SELECT
            action,
            COUNT(*) AS total

        FROM recovery_history

        WHERE
            problem = ?
            AND status = 'Success'

        GROUP BY action

        ORDER BY total DESC

        LIMIT 1

    """, (problem,))

    row = cursor.fetchone()

    conn.close()

    if row:

        return {

            "action": row[0],

            "successes": row[1]

        }

    return {

        "action": None,

        "successes": 0

    }