"""
CPU Monitoring
"""

import psutil


def get_cpu_usage():
    """
    Return current CPU usage.
    Uses a very small interval so values are accurate
    without slowing the dashboard.
    """
    return round(psutil.cpu_percent(interval=0.1), 1)