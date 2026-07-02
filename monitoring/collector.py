"""
Collect all system metrics
"""

from monitoring.cpu_monitor import get_cpu_usage
from monitoring.memory_monitor import get_memory_usage
from monitoring.disk_monitor import get_disk_usage
from monitoring.network_monitor import get_network_usage
from monitoring.process_monitor import get_process_count


def collect_metrics():

    network = get_network_usage()

    data = {

        "cpu": get_cpu_usage(),

        "memory": get_memory_usage(),

        "disk": get_disk_usage(),

        "network_sent": network["sent"],

        "network_received": network["received"],

        "processes": get_process_count()

    }

    return data