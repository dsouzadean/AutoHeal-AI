"""
Available Self-Healing Actions
"""


def get_recovery_action(root_cause):

    if root_cause == "High CPU Usage":
        return "Terminate High CPU Process"

    elif root_cause == "High Memory Usage":
        return "Clear Memory Cache"

    elif root_cause == "Disk Almost Full":
        return "Clean Temporary Files"

    elif root_cause == "High Network Activity":
        return "Reset Network Adapter"

    else:
        return "No Action Required"