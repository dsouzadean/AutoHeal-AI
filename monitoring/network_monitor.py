"""
Network Monitoring
"""

import psutil


def get_network_usage():

    net = psutil.net_io_counters()

    return {
        "sent": net.bytes_sent,
        "received": net.bytes_recv
    }