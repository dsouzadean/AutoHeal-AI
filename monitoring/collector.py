"""
Collect all system metrics
"""

import time
import platform
import socket
import psutil

from monitoring.cpu_monitor import get_cpu_usage
from monitoring.memory_monitor import get_memory_usage
from monitoring.disk_monitor import get_disk_usage
from monitoring.network_monitor import get_network_usage
from monitoring.process_monitor import get_process_count
from monitoring.process_analyzer import get_top_process


# =====================================
# Metrics Cache
# =====================================

CACHE = None
LAST_UPDATE = 0
CACHE_DURATION = 2  # seconds


def collect_metrics():

    global CACHE
    global LAST_UPDATE

    current_time = time.time()

    # Return cached metrics if they are still fresh
    if CACHE is not None and (current_time - LAST_UPDATE) < CACHE_DURATION:
        return CACHE

    network = get_network_usage()
    top_process = get_top_process()

    data = {

        # ===============================
        # Live Metrics
        # ===============================

        "cpu": get_cpu_usage(),

        "memory": get_memory_usage(),

        "disk": get_disk_usage(),

        "network_sent": network["sent"],

        "network_received": network["received"],

        "processes": get_process_count(),

        # ===============================
        # System Information
        # ===============================

        "os": platform.system(),

        "hostname": socket.gethostname(),

        "cpu_cores": psutil.cpu_count(),

        "total_ram": round(
            psutil.virtual_memory().total / (1024 ** 3),
            2
        ),

        "total_disk": round(
            psutil.disk_usage("C:\\").total / (1024 ** 3),
            2
        ),

        # ===============================
        # Process Analysis
        # ===============================

        "top_process": top_process["name"],

        "top_process_pid": top_process["pid"],

        "top_memory": round(
            top_process["memory_percent"],
            2
        ),

        "top_cpu": round(
            top_process["cpu_percent"],
            2
        )
    }
        # =====================================
    # Update Cache
    # =====================================

    CACHE = data
    LAST_UPDATE = current_time

    return data