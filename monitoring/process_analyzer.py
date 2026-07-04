"""
Process Analyzer
"""

import psutil


def get_top_process():
    """
    Returns the process using the highest memory.
    """

    highest = None

    for process in psutil.process_iter(
        ["pid", "name", "memory_percent", "cpu_percent"]
    ):

        try:

            info = process.info

            if (
                highest is None or
                info["memory_percent"] > highest["memory_percent"]
            ):
                highest = info

        except (
            psutil.NoSuchProcess,
            psutil.AccessDenied,
            psutil.ZombieProcess
        ):
            continue

    if highest is None:

        return {

            "pid": "-",

            "name": "Unknown",

            "memory_percent": 0,

            "cpu_percent": 0

        }

    return highest