"""
AI Root Cause Analysis
"""


def analyze_root_cause(metrics):
    """
    Analyze the most likely root cause of an anomaly.
    """

    cpu = metrics.get("cpu", 0)
    memory = metrics.get("memory", 0)
    disk = metrics.get("disk", 0)
    network = (
        metrics.get("network_sent", 0)
        + metrics.get("network_received", 0)
    )

    # High CPU
    if cpu >= 85:
        return {
            "root_cause": "High CPU Usage",
            "recommended_action": "Terminate High CPU Process"
        }

    # High Memory
    elif memory >= 85:
        return {
            "root_cause": "High Memory Usage",
            "recommended_action": "Clear Memory Cache"
        }

    # High Disk
    elif disk >= 90:
        return {
            "root_cause": "Disk Almost Full",
            "recommended_action": "Clean Temporary Files"
        }

    # Heavy Network Traffic
    elif network >= 500000000:
        return {
            "root_cause": "High Network Activity",
            "recommended_action": "Reset Network Adapter"
        }

    # AI detected anomaly but no exact match
    elif metrics.get("ai_status") == "Anomaly":

        # Choose the highest stressed resource
        values = {
            "cpu": cpu,
            "memory": memory,
            "disk": disk
        }

        highest = max(values, key=values.get)

        if highest == "cpu":
            return {
                "root_cause": "Potential CPU Bottleneck",
                "recommended_action": "Restart High CPU Service"
            }

        elif highest == "memory":
            return {
                "root_cause": "Potential Memory Leak",
                "recommended_action": "Restart Memory Intensive Process"
            }

        else:
            return {
                "root_cause": "Potential Disk Issue",
                "recommended_action": "Clean Temporary Files"
            }

    # Normal
    return {
        "root_cause": "System Operating Normally",
        "recommended_action": "No Action Required"
    }