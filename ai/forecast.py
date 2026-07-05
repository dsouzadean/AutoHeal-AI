"""
AutoHeal-AI Forecast Engine

Predicts future system health using
historical metrics.
"""

from database.metrics_storage import load_metrics_history


def forecast():

    history = load_metrics_history(20)

    if len(history) < 5:

        return {

            "future_cpu": 0,

            "future_memory": 0,

            "future_disk": 0,

            "forecast_status": "Insufficient Data"

        }

    cpu_values = [row["cpu"] for row in history]

    memory_values = [row["memory"] for row in history]

    disk_values = [row["disk"] for row in history]

    def predict(values):

        recent = values[:5]

        trend = recent[0] - recent[-1]

        prediction = recent[0] + trend

        prediction = max(0, min(100, prediction))

        return round(prediction, 1)

    future_cpu = predict(cpu_values)

    future_memory = predict(memory_values)

    future_disk = predict(disk_values)

    highest = max(

        future_cpu,

        future_memory,

        future_disk

    )

    if highest >= 90:

        status = "CRITICAL"

    elif highest >= 75:

        status = "HIGH"

    elif highest >= 55:

        status = "MEDIUM"

    else:

        status = "LOW"

    return {

        "future_cpu": future_cpu,

        "future_memory": future_memory,

        "future_disk": future_disk,

        "forecast_status": status

    }