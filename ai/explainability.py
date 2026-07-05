"""
AI Explainability Engine
"""


def explain_prediction(metrics):

    cpu = float(metrics.get("cpu", 0))
    memory = float(metrics.get("memory", 0))
    disk = float(metrics.get("disk", 0))
    processes = int(metrics.get("processes", 0))

    contributions = {

        "CPU": round(cpu * 0.40, 2),

        "Memory": round(memory * 0.30, 2),

        "Disk": round(disk * 0.20, 2),

        "Processes": round(
            min(processes / 300 * 100, 100) * 0.10,
            2
        )

    }

    primary = max(
        contributions,
        key=contributions.get
    )

    return {

        "primary_cause": primary,

        "contributions": contributions

    }