"""
Self-Healing Configuration
"""

AUTO_RECOVERY = True


def enable_auto_recovery():
    global AUTO_RECOVERY
    AUTO_RECOVERY = True


def disable_auto_recovery():
    global AUTO_RECOVERY
    AUTO_RECOVERY = False


def is_auto_recovery_enabled():
    return AUTO_RECOVERY