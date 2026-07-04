"""
Self-Healing Engine
"""

import time

from monitoring.collector import collect_metrics
from self_healing.actions import get_recovery_action
from database.recovery_storage import save_recovery


def execute_recovery(root_cause):
    """
    Execute a recovery action and verify whether
    the system returned to a healthy state.
    """

    # Determine recovery action
    action = get_recovery_action(root_cause)

    print(f"[Recovery] Executing: {action}")

    # Start timer
    start_time = time.time()

    # ======================================================
    # Simulated Recovery
    # (Later we'll replace this with actual process/service
    # restart logic.)
    # ======================================================
    time.sleep(2)

    # Measure execution time
    duration = round(time.time() - start_time, 2)

    # Collect fresh metrics after recovery
    metrics = collect_metrics()

    # Verify recovery
    if (
        metrics["cpu"] < 85
        and metrics["memory"] < 85
        and metrics["disk"] < 90
    ):
        status = "Success"
    else:
        status = "Failed"

    # Save recovery log
    save_recovery(
        problem=root_cause,
        action=action,
        status=status,
        process=metrics.get("top_process", "Unknown"),
        pid=metrics.get("top_process_pid", 0),
        duration=duration
    )

    return {
        "action": action,
        "status": status,
        "verification": status,
        "duration": duration,
        "process": metrics.get("top_process", "Unknown"),
        "pid": metrics.get("top_process_pid", 0)
    }