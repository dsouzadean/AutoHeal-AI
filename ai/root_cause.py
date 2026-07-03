"""
AI Root Cause Analysis
"""


def analyze_root_cause(metrics):
    """
    Analyze the most likely root cause of an anomaly
    based on current system metrics.
    """

    # High CPU
    if metrics["cpu"] > 85:
        return {
            "root_cause": "High CPU Usage",
            "recommended_action": "Terminate High CPU Process"
        }

    # High Memory
    elif metrics["memory"] > 85:
        return {
            "root_cause": "High Memory Usage",
            "recommended_action": "Clear Memory Cache"
        }

    # High Disk
    elif metrics["disk"] > 90:
        return {
            "root_cause": "Disk Almost Full",
            "recommended_action": "Clean Temporary Files"
        }

    # High Network Activity
    elif (
        metrics["network_sent"] +
        metrics["network_received"]
    ) > 500000000:

        return {
            "root_cause": "High Network Activity",
            "recommended_action": "Reset Network Adapter"
        }

    # AI detected an anomaly but no rule matched
    elif metrics.get("ai_status") == "Anomaly":

        return {
            "root_cause": "Unknown Anomalous Behaviour",
            "recommended_action": "Collect Additional Diagnostics"
        }

    # System is healthy
    return {
        "root_cause": "System Operating Normally",
        "recommended_action": "No Action Required"
    }