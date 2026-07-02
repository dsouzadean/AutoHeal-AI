"""
AutoHeal-AI Main Application
"""

from flask import Flask, jsonify, render_template

from database import initialize_database
from monitoring.collector import collect_metrics
from database.metrics_storage import save_metrics
from dashboard.api import api

# AI Module
from ai.anomaly_detection import detect_anomaly

app = Flask(__name__)

# Initialize Database
initialize_database()

# Register API Blueprint
app.register_blueprint(api)


@app.route("/")
def dashboard():
    return render_template("dashboard.html")


@app.route("/api/metrics")
def metrics():

    # Collect metrics
    data = collect_metrics()

    # Save metrics
    save_metrics(data)

    # AI Detection
    ai_result = detect_anomaly(data)

    data["ai_status"] = ai_result["status"]

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)