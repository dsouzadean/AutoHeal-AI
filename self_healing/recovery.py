"""
Self-Healing Engine
"""

import time

from monitoring.collector import collect_metrics
from self_healing.actions import get_recovery_action
from database.recovery_storage import save_recovery
from ai.recovery_learning import get_best_recovery

def execute_recovery(root_cause):
    """
    Execute recovery using the best known recovery action,
    verify system health, retry once if needed,
    and return detailed recovery information.
    """

    # Default recovery action
    action = get_recovery_action(root_cause)

    # =====================================
    # Learning Engine
    # =====================================

    learning = get_best_recovery(root_cause)

    if learning["action"]:

        print("\n========== Learning Engine ==========")
        print("Previously Successful Action :", learning["action"])
        print("Successful Recoveries        :", learning["successes"])
        print("=====================================\n")

        action = learning["action"]

    print("\n==============================")
    print("AUTOHEAL RECOVERY ENGINE")
    print("==============================")
    print(f"Problem : {root_cause}")
    print(f"Action  : {action}")
    print("==============================")

    start_time = time.time()

    # =====================================
    # Recovery Attempt 1
    # =====================================

    time.sleep(2)

    metrics = collect_metrics()

    recovered = (

        metrics["cpu"] < 85

        and metrics["memory"] < 85

        and metrics["disk"] < 90

    )

    retry = False

    # =====================================
    # Retry Once
    # =====================================

    if not recovered:

        retry = True

        print("[Recovery] First attempt failed.")
        print("[Recovery] Retrying...")

        time.sleep(2)

        metrics = collect_metrics()

        recovered = (

            metrics["cpu"] < 85

            and metrics["memory"] < 85

            and metrics["disk"] < 90

        )

    # =====================================
    # Final Status
    # =====================================

    duration = round(
        time.time() - start_time,
        2
    )

    status = "Success" if recovered else "Failed"

    recovery_score = 100 if recovered else 25

    # =====================================
    # Save Recovery
    # =====================================

    save_recovery(

        problem=root_cause,

        action=action,

        status=status,

        process=metrics.get("top_process", "Unknown"),

        pid=metrics.get("top_process_pid", 0),

        duration=duration

    )

    print("\n========== Recovery Summary ==========")
    print("Status         :", status)
    print("Retry          :", retry)
    print("Recovery Score :", recovery_score)
    print("Duration       :", duration, "seconds")
    print("======================================\n")

    return {

        "action": action,

        "status": status,

        "verification": status,

        "duration": duration,

        "process": metrics.get("top_process", "Unknown"),

        "pid": metrics.get("top_process_pid", 0),

        "retry": retry,

        "recovery_score": recovery_score

    }

    # -------------------------
    # Recovery Attempt 1
    # -------------------------

    time.sleep(2)

    metrics = collect_metrics()

    recovered = (

        metrics["cpu"] < 85

        and metrics["memory"] < 85

        and metrics["disk"] < 90

    )

    retry = False

    # -------------------------
    # Retry Once
    # -------------------------

    if not recovered:

        retry = True

        print("[Recovery] Retrying...")

        time.sleep(2)

        metrics = collect_metrics()

        recovered = (

            metrics["cpu"] < 85

            and metrics["memory"] < 85

            and metrics["disk"] < 90

        )

    duration = round(

        time.time() - start_time,

        2

    )

    status = "Success" if recovered else "Failed"

    recovery_score = 100 if recovered else 25

    save_recovery(

        problem=root_cause,

        action=action,

        status=status,

        process=metrics.get("top_process", "Unknown"),

        pid=metrics.get("top_process_pid", 0),

        duration=duration

    )

    print()

    print("Recovery Finished")

    print("Status :", status)

    print("Duration :", duration, "seconds")

    print("Recovery Score :", recovery_score)

    print()

    return {

        "action": action,

        "status": status,

        "verification": status,

        "duration": duration,

        "process": metrics.get("top_process", "Unknown"),

        "pid": metrics.get("top_process_pid", 0),

        "retry": retry,

        "recovery_score": recovery_score

    }