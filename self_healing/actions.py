"""
Available Self-Healing Actions
"""


def get_recovery_action(root_cause):
    """
    Returns the recovery action for a detected root cause.
    """

    actions = {

        # CPU
        "High CPU Usage":
            "Terminate High CPU Process",

        "Potential CPU Bottleneck":
            "Restart High CPU Service",

        # Memory
        "High Memory Usage":
            "Clear Memory Cache",

        "Potential Memory Leak":
            "Restart Memory Intensive Process",

        # Disk
        "Disk Almost Full":
            "Clean Temporary Files",

        "Potential Disk Issue":
            "Clean Temporary Files",

        # Network
        "High Network Activity":
            "Reset Network Adapter",

        # Generic
        "Unknown Anomalous Behaviour":
            "Collect Diagnostic Logs",

        "System Operating Normally":
            "No Action Required"

    }

    return actions.get(root_cause, "Collect Diagnostic Logs")