"""
Self-Healing Logger
"""

from datetime import datetime


def log_recovery(problem, action, status):

    return {
        "timestamp": datetime.now().strftime("%d %b %Y %I:%M:%S %p"),
        "problem": problem,
        "action": action,
        "status": status
    }