"""
Running Processes
"""

import psutil


def get_process_count():

    return len(psutil.pids())