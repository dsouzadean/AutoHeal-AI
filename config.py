"""
Global configuration for AutoHeal-AI
"""

import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

DATABASE_PATH = os.path.join(BASE_DIR, "database", "autoheal.db")

SECRET_KEY = "autoheal-ai"

MONITOR_INTERVAL = 5      # seconds

MODEL_PATH = os.path.join(BASE_DIR, "models")

LOG_PATH = os.path.join(BASE_DIR, "logs")

REPORT_PATH = os.path.join(BASE_DIR, "reports")