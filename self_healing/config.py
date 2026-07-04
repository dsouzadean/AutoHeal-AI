"""
Application Configuration
"""

auto_recovery = True

cpu_threshold = 85
memory_threshold = 85


# ===============================
# Auto Recovery
# ===============================

def enable_auto_recovery():
    global auto_recovery
    auto_recovery = True


def disable_auto_recovery():
    global auto_recovery
    auto_recovery = False


def is_auto_recovery_enabled():
    return auto_recovery


# ===============================
# Threshold Configuration
# ===============================

def set_cpu_threshold(value):
    global cpu_threshold
    cpu_threshold = int(value)


def set_memory_threshold(value):
    global memory_threshold
    memory_threshold = int(value)


def get_cpu_threshold():
    return cpu_threshold


def get_memory_threshold():
    return memory_threshold