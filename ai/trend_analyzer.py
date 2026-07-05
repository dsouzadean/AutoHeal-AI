"""
AutoHeal-AI Trend Analyzer

Analyzes recent prediction history to determine
whether system health is improving or deteriorating.
"""

from database.prediction_history import load_recent_predictions


def analyze_trend():

    rows = load_recent_predictions(20)

    if len(rows) < 5:

        return {

            "trend": "UNKNOWN",

            "change": 0,

            "message": "Not enough historical data"

        }

    probabilities = [row[4] for row in rows]

    newest = probabilities[0]
    oldest = probabilities[-1]

    difference = newest - oldest

    if difference >= 20:

        trend = "RISING"

        message = "Failure probability increasing rapidly."

    elif difference >= 8:

        trend = "INCREASING"

        message = "System health slowly degrading."

    elif difference <= -20:

        trend = "RECOVERING"

        message = "System health improving."

    elif difference <= -8:

        trend = "STABLE"

        message = "Metrics returning to normal."

    else:

        trend = "FLAT"

        message = "No significant change."

    return {

        "trend": trend,

        "change": round(difference,2),

        "message": message

    }