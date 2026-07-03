"""
Self-Healing Engine
"""

from self_healing.actions import get_recovery_action
from database.recovery_storage import save_recovery


def execute_recovery(root_cause):

    action = get_recovery_action(root_cause)

    status = "Success"

    save_recovery(
        root_cause,
        action,
        status
    )

    return {
        "action": action,
        "status": status
    }