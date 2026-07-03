"""
Collect all system metrics
"""

from monitoring.cpu_monitor import get_cpu_usage
from monitoring.memory_monitor import get_memory_usage
from monitoring.disk_monitor import get_disk_usage
from monitoring.network_monitor import get_network_usage
from monitoring.process_monitor import get_process_count

import platform
import socket
import psutil


def collect_metrics():

    network = get_network_usage()

    data = {

        "cpu": get_cpu_usage(),

        "memory": get_memory_usage(),

        "disk": get_disk_usage(),

        "network_sent": network["sent"],

        "network_received": network["received"],

        "processes": get_process_count(),

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
        )

    }

    return data