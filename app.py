"""
AutoHeal-AI Main Application
"""

import time

from flask import Flask, jsonify, render_template, request

from database import initialize_database
from database.metrics_storage import save_metrics
from database.recovery_storage import initialize_recovery_table

from monitoring.collector import collect_metrics

from dashboard.api import api

from ai.anomaly_detection import detect_anomaly
from ai.root_cause import analyze_root_cause

from self_healing.recovery import execute_recovery

from self_healing.config import (
    enable_auto_recovery,
    disable_auto_recovery,
    is_auto_recovery_enabled,
    set_cpu_threshold,
    set_memory_threshold,
    get_cpu_threshold,
    get_memory_threshold
)

app = Flask(__name__)

# =====================================
# Metrics Save Cache
# =====================================

LAST_SAVE = 0
SAVE_INTERVAL = 30

# =====================================
# Initialize Database
# =====================================

initialize_database()
initialize_recovery_table()

# =====================================
# Register Blueprint
# =====================================

app.register_blueprint(api)

# =====================================
# Pages
# =====================================

@app.route("/")
def dashboard():
    return render_template("dashboard.html")


@app.route("/dashboard")
def dashboard_page():
    return render_template("dashboard.html")


@app.route("/monitoring")
def monitoring():
    return render_template("monitoring.html")


@app.route("/ai-analysis")
def ai_analysis():
    return render_template("ai_analysis.html")


@app.route("/incidents")
def incidents():
    return render_template("incidents.html")


@app.route("/reports")
def reports():
    return render_template("reports.html")


@app.route("/settings")
def settings():
    return render_template("settings.html")


# =====================================
# Metrics API
# =====================================

@app.route("/api/metrics")
def metrics():

    global LAST_SAVE

    # ---------------------------------
    # Collect Live Metrics
    # ---------------------------------

    data = collect_metrics()

    # ---------------------------------
    # Save Metrics Every 30 Seconds
    # ---------------------------------

    current_time = time.time()

    if current_time - LAST_SAVE >= SAVE_INTERVAL:

        save_metrics(data)
        LAST_SAVE = current_time

    # ---------------------------------
    # AI Detection
    # ---------------------------------

    ai_result = detect_anomaly(data)

    # Ignore AI false positives when
    # the system metrics are healthy.
    if (
        ai_result["status"] == "Anomaly"
        and data["cpu"] < 85
        and data["memory"] < 85
        and data["disk"] < 90
    ):
        ai_result["status"] = "Normal"
        ai_result["prediction"] = 1

    data["ai_status"] = ai_result["status"]
    data["prediction"] = ai_result["prediction"]
    data["score"] = ai_result.get("score", 0)

    # ---------------------------------
    # Default Values
    # ---------------------------------

    data["root_cause"] = "System Operating Normally"
    data["recommended_action"] = "No Action Required"

    data["suspect_process"] = data.get("top_process", "Unknown")
    data["pid"] = data.get("top_process_pid", "-")

    # Confidence
    if ai_result["status"] == "Normal":
        data["confidence"] = 0
    else:
        data["confidence"] = 95

    data["recovery_status"] = "Idle"
    data["recovery_action"] = "No Action Required"

    # ---------------------------------
    # Root Cause Analysis
    # ---------------------------------

    if ai_result["status"] == "Anomaly":

        root = analyze_root_cause(data)

        data["root_cause"] = root["root_cause"]
        data["recommended_action"] = root["recommended_action"]

        data["suspect_process"] = root["suspect_process"]
        data["pid"] = root["pid"]
        data["confidence"] = root["confidence"]

        # Only recover if a real issue exists
        if root["root_cause"] != "System Operating Normally":

            if is_auto_recovery_enabled():

                recovery = execute_recovery(
                    root["root_cause"]
                )

                data["recovery_status"] = recovery["status"]
                data["recovery_action"] = recovery["action"]

            else:

                data["recovery_status"] = "Waiting"
                data["recovery_action"] = "Manual Recovery Required"

        else:

            # AI false positive
            data["ai_status"] = "Normal"
            data["prediction"] = 1
            data["confidence"] = 0
            data["recovery_status"] = "Idle"
            data["recovery_action"] = "No Action Required"

    return jsonify(data)
# =====================================
# Auto Recovery Status
# =====================================

@app.route("/api/recovery-status")
def recovery_status():

    return jsonify({
        "enabled": is_auto_recovery_enabled()
    })


# =====================================
# Toggle Auto Recovery
# =====================================

@app.route("/api/toggle-recovery", methods=["POST"])
def toggle_recovery():

    if is_auto_recovery_enabled():
        disable_auto_recovery()
    else:
        enable_auto_recovery()

    return jsonify({
        "enabled": is_auto_recovery_enabled()
    })


# =====================================
# Update Thresholds
# =====================================

@app.route("/api/update-thresholds", methods=["POST"])
def update_thresholds():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data received"
        }), 400

    cpu = float(data.get("cpu", get_cpu_threshold()))
    memory = float(data.get("memory", get_memory_threshold()))

    set_cpu_threshold(cpu)
    set_memory_threshold(memory)

    return jsonify({
        "cpu": get_cpu_threshold(),
        "memory": get_memory_threshold(),
        "message": "Thresholds Updated Successfully"
    })


# =====================================
# Manual Recovery
# =====================================

@app.route("/api/manual-recovery", methods=["POST"])
def manual_recovery():

    data = collect_metrics()

    root = analyze_root_cause(data)

    recovery = execute_recovery(
        root["root_cause"]
    )

    return jsonify({

        "status": recovery["status"],

        "action": recovery["action"],

        "problem": root["root_cause"],

        "verification": recovery["verification"],

        "duration": recovery.get("duration", 0),

        "process": recovery.get("process", "Unknown"),

        "pid": recovery.get("pid", 0)

    })


# =====================================
# Health Check
# =====================================

@app.route("/api/health")
def health():

    return jsonify({

        "status": "running",

        "application": "AutoHeal-AI"

    })


# =====================================
# Run Application
# =====================================

if __name__ == "__main__":

    app.run(

        debug=True,

        host="127.0.0.1",

        port=5000,

        threaded=True

    )