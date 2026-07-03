"""
AutoHeal-AI Main Application
"""

from flask import Flask, jsonify, render_template

from database import initialize_database
from database.metrics_storage import save_metrics
from database.recovery_storage import initialize_recovery_table

from monitoring.collector import collect_metrics

from dashboard.api import api

from ai.anomaly_detection import detect_anomaly
from ai.root_cause import analyze_root_cause

from self_healing.recovery import execute_recovery
from self_healing.config import is_auto_recovery_enabled

from flask import request

from self_healing.config import (
    enable_auto_recovery,
    disable_auto_recovery,
    is_auto_recovery_enabled
)


app = Flask(__name__)

# Initialize Database
initialize_database()
initialize_recovery_table()

# Register API Blueprint
app.register_blueprint(api)


@app.route("/")
def dashboard():
    return render_template("dashboard.html")

# ===============================
# Additional Pages
# ===============================

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

@app.route("/api/metrics")
def metrics():

    # Collect live system metrics
    data = collect_metrics()

    # Save metrics
    save_metrics(data)

    # AI Anomaly Detection
    ai_result = detect_anomaly(data)

    data["ai_status"] = ai_result["status"]
    data["prediction"] = ai_result["prediction"]
    data["score"] = ai_result.get("score", 0)

    # Default values
    data["root_cause"] = "System Operating Normally"
    data["recommended_action"] = "No Action Required"

    data["recovery_status"] = "Idle"
    data["recovery_action"] = "None"

    # Run AI analysis only when anomaly is detected
    if ai_result["status"] == "Anomaly":

        root = analyze_root_cause(data)

        data["root_cause"] = root["root_cause"]
        data["recommended_action"] = root["recommended_action"]

        if is_auto_recovery_enabled():

            recovery = execute_recovery(root["root_cause"])

            data["recovery_status"] = recovery["status"]
            data["recovery_action"] = recovery["action"]

        else:

            data["recovery_status"] = "Waiting"
            data["recovery_action"] = "Manual Recovery Required"

    return jsonify(data)
    
@app.route("/api/recovery-status")
def recovery_status():

    return jsonify({
        "enabled": is_auto_recovery_enabled()
    })


@app.route("/api/toggle-recovery", methods=["POST"])
def toggle_recovery():

    if is_auto_recovery_enabled():
        disable_auto_recovery()
    else:
        enable_auto_recovery()

    return jsonify({
        "enabled": is_auto_recovery_enabled()
    })

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

        "problem": root["root_cause"]

    })


if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )