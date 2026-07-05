"""
Overall AI Health Score
"""


def calculate_health_score(metrics):

    cpu = float(metrics.get("cpu", 0))
    memory = float(metrics.get("memory", 0))
    disk = float(metrics.get("disk", 0))

    process_count = int(metrics.get("processes", 0))

    score = 100

    score -= cpu * 0.35

    score -= memory * 0.30

    score -= disk * 0.20

    process_penalty = min(process_count / 20, 15)

    score -= process_penalty

    score = max(0, min(100, round(score, 1)))

    if score >= 90:
        status = "Excellent"

    elif score >= 75:
        status = "Healthy"

    elif score >= 60:
        status = "Warning"

    elif score >= 40:
        status = "Poor"

    else:
        status = "Critical"

    return {

        "score": score,

        "status": status

    }