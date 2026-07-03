"""
AI Severity Analysis
"""


def calculate_severity(metrics):

    score = 0

    if metrics["cpu"] > 90:
        score += 3
    elif metrics["cpu"] > 80:
        score += 2
    elif metrics["cpu"] > 70:
        score += 1

    if metrics["memory"] > 90:
        score += 3
    elif metrics["memory"] > 80:
        score += 2
    elif metrics["memory"] > 70:
        score += 1

    if metrics["disk"] > 95:
        score += 3
    elif metrics["disk"] > 85:
        score += 2

    network = (
        metrics["network_sent"] +
        metrics["network_received"]
    )

    if network > 1000000000:
        score += 3
    elif network > 500000000:
        score += 2

    if score >= 8:
        return "Critical"

    elif score >= 5:
        return "High"

    elif score >= 3:
        return "Medium"

    return "Low"
