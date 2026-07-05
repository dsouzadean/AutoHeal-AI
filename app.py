"""
AutoHeal-AI Main Application
"""

import time

from flask import Flask, jsonify, render_template, request
from database.incident_storage import save_incident
from database import initialize_database
from database.metrics_storage import save_metrics
from database.recovery_storage import initialize_recovery_table
from notifications.email_alert import send_email_alert
from monitoring.collector import collect_metrics
from ai.failure_prediction import predict_failure
from ai.trend_analyzer import analyze_trend
from ai.health_score import calculate_health_score
from ai.forecast import forecast
from ai.explainability import explain_prediction

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

from database.prediction_history import (
    initialize_prediction_table,
    save_prediction
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
initialize_prediction_table()

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

    current_time = time.time()

    # ---------------------------------
    # AI Detection
    # ---------------------------------

    ai_result = detect_anomaly(data)

    data["ai_status"] = ai_result["status"]
    data["prediction"] = ai_result["prediction"]
    data["score"] = ai_result.get("score", 0)

    # ---------------------------------
    # Failure Prediction (ML)
    # ---------------------------------

    failure = predict_failure(data)

    data["failure_probability"] = failure["failure_probability"]
    data["failure_confidence"] = failure["confidence"]
    data["estimated_failure_time"] = failure["estimated_time_minutes"]
    data["risk_level"] = failure["risk"]
    data["recommendation"] = failure["recommendation"]

    # ---------------------------------
    # Explainable AI
    # ---------------------------------

    explanation = explain_prediction(data)

    data["primary_cause"] = explanation["primary_cause"]
    data["contributions"] = explanation["contributions"]

    # ---------------------------------
    # Forecast Engine
    # ---------------------------------

    forecast_result = forecast()

    data["future_cpu"] = forecast_result["future_cpu"]
    data["future_memory"] = forecast_result["future_memory"]
    data["future_disk"] = forecast_result["future_disk"]
    data["forecast_status"] = forecast_result["forecast_status"]

    # ---------------------------------
    # Health Score
    # ---------------------------------

    health = calculate_health_score(data)

    data["health_score"] = health["score"]
    data["health_status"] = health["status"]

    # ---------------------------------
    # Trend Analysis
    # ---------------------------------

    trend = analyze_trend()

    data["trend"] = trend["trend"]
    data["trend_change"] = trend["change"]
    data["trend_message"] = trend["message"]

    # ---------------------------------
    # Save Metrics + Prediction
    # Every 30 Seconds
    # ---------------------------------

    if current_time - LAST_SAVE >= SAVE_INTERVAL:

        save_metrics(data)

        save_prediction(data, failure)

        LAST_SAVE = current_time

    # ---------------------------------
    # Default Values
    # ---------------------------------

    data["root_cause"] = "System Operating Normally"
    data["recommended_action"] = "No Action Required"

    data["suspect_process"] = data.get("top_process", "Unknown")
    data["pid"] = data.get("top_process_pid", "-")

    if ai_result["status"] == "Normal":

        data["confidence"] = 0

    else:

        data["confidence"] = 95

    data["recovery_status"] = "Idle"
    data["recovery_action"] = "No Action Required"

    # ---------------------------------
    # Root Cause Analysis
    # ---------------------------------

    risk = data["risk_level"]

    should_recover = (

        ai_result["status"] == "Anomaly"

        or (

            risk == "CRITICAL"

            and is_auto_recovery_enabled()

        )

    )

    if should_recover:

        print("\n========== AI Prediction ==========")
        print(f"Risk Level : {risk}")
        print(f"Probability : {data['failure_probability']}%")
        print(f"Confidence : {data['failure_confidence']}%")
        print("===================================\n")

        root = analyze_root_cause(data)

        data["root_cause"] = root["root_cause"]
        data["recommended_action"] = root["recommended_action"]

        data["suspect_process"] = root["suspect_process"]
        data["pid"] = root["pid"]
        data["confidence"] = root["confidence"]

        if root["root_cause"] != "System Operating Normally":

            save_incident(

                prediction=f"{data['failure_probability']}%",

                confidence=root["confidence"],

                root_cause=root["root_cause"],

                action=root["recommended_action"],

                status="Detected"

            )

            if is_auto_recovery_enabled():

                recovery = execute_recovery(

                    root["root_cause"]

                )

                data["recovery_status"] = recovery["status"]
                data["recovery_action"] = recovery["action"]

                send_email_alert(

                    prediction=data["failure_probability"],

                    root_cause=root["root_cause"],

                    confidence=root["confidence"],

                    action=root["recommended_action"],

                    recovery_status=recovery["status"]

                )

            else:

                data["recovery_status"] = "Waiting"
                data["recovery_action"] = "Manual Recovery Required"

        else:

            data["ai_status"] = "Normal"
            data["prediction"] = 1
            data["confidence"] = 0
            data["recovery_status"] = "Idle"
            data["recovery_action"] = "No Action Required"

    return jsonify(data)


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

    # Collect current metrics
    data = collect_metrics()

    # Analyze current problem
    root = analyze_root_cause(data)

    # Execute recovery
    recovery = execute_recovery(
        root["root_cause"]
    )

    # Return complete recovery information
    return jsonify({

        "status": recovery["status"],

        "action": recovery["action"],

        "problem": root["root_cause"],

        "verification": recovery["verification"],

        "duration": recovery.get("duration", 0),

        "process": recovery.get("process", "Unknown"),

        "pid": recovery.get("pid", 0),

        "retry": recovery.get("retry", False),

        "recovery_score": recovery.get("recovery_score", 0)

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