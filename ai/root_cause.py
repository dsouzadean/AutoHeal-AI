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

    process = metrics.get("top_process", "Unknown")
    pid = metrics.get("top_process_pid", 0)

    network = (
        metrics.get("network_sent", 0)
        + metrics.get("network_received", 0)
    )

    # ===============================
    # High CPU
    # ===============================

    if cpu >= 85:

        return {
            "root_cause": "High CPU Usage",
            "recommended_action": f"Restart or terminate {process}",
            "suspect_process": process,
            "pid": pid,
            "confidence": 95
        }

    # ===============================
    # High Memory
    # ===============================

    elif memory >= 85:

        return {
            "root_cause": "Potential Memory Leak",
            "recommended_action": f"Restart {process}",
            "suspect_process": process,
            "pid": pid,
            "confidence": 96
        }

    # ===============================
    # Disk
    # ===============================

    elif disk >= 90:

        return {
            "root_cause": "Disk Almost Full",
            "recommended_action": "Clean Temporary Files",
            "suspect_process": process,
            "pid": pid,
            "confidence": 92
        }

    # ===============================
    # Network
    # ===============================

    elif network >= 500000000:

        return {
            "root_cause": "High Network Activity",
            "recommended_action": "Reset Network Adapter",
            "suspect_process": process,
            "pid": pid,
            "confidence": 90
        }

    # ===============================
    # Normal
    # ===============================

    return {

        "root_cause": "System Operating Normally",

        "recommended_action": "No Action Required",

        "suspect_process": process,

        "pid": pid,

        "confidence": 100

    }