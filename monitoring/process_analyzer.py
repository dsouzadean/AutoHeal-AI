"""
Process Analyzer
"""

import time
import psutil

# =====================================
# Cache
# =====================================

CACHE = None
LAST_SCAN = 0
SCAN_INTERVAL = 5  # seconds


def get_top_process():
    """
    Returns the process using the highest memory.
    Uses a cache to avoid scanning all processes
    on every dashboard refresh.
    """

    global CACHE
    global LAST_SCAN

    current_time = time.time()

    # Return cached result if recent
    if CACHE is not None and (current_time - LAST_SCAN) < SCAN_INTERVAL:
        return CACHE

    highest = {
        "pid": 0,
        "name": "Unknown",
        "memory_percent": 0.0,
        "cpu_percent": 0.0
    }

    for process in psutil.process_iter(
        ["pid", "name", "memory_percent", "cpu_percent"]
    ):

        try:

            info = process.info

            memory = info.get("memory_percent") or 0
            cpu = info.get("cpu_percent") or 0

            if memory > highest["memory_percent"]:

                highest = {
                    "pid": info.get("pid", 0),
                    "name": info.get("name", "Unknown"),
                    "memory_percent": round(memory, 2),
                    "cpu_percent": round(cpu, 2)
                }

        except (
            psutil.NoSuchProcess,
            psutil.AccessDenied,
            psutil.ZombieProcess
        ):
            continue

    CACHE = highest
    LAST_SCAN = current_time

    return CACHE