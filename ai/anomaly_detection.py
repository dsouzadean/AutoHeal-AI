"""
AI Anomaly Detection
"""

import os
import joblib
import pandas as pd

from sklearn.ensemble import IsolationForest

MODEL_PATH = "models/anomaly_model.pkl"

FEATURES = [
    "cpu",
    "memory",
    "disk",
    "network_sent",
    "network_received",
    "processes"
]


def train_model(dataframe):
    """
    Train Isolation Forest using historical metrics.
    """

    if dataframe.empty:
        raise ValueError("No training data available.")

    missing = [c for c in FEATURES if c not in dataframe.columns]

    if missing:
        raise ValueError(f"Missing columns: {missing}")

    model = IsolationForest(
        contamination=0.05,
        random_state=42,
        n_estimators=100
    )

    model.fit(dataframe[FEATURES])

    os.makedirs("models", exist_ok=True)

    joblib.dump(model, MODEL_PATH)

    print("AI Model Trained Successfully")


def detect_anomaly(metrics):
    """
    Detect anomaly using AI model.
    Uses rule verification so AI status
    always agrees with root cause analysis.
    """

    cpu = metrics.get("cpu", 0)
    memory = metrics.get("memory", 0)
    disk = metrics.get("disk", 0)

    # -------------------------------------
    # Rule Override
    # -------------------------------------

    if cpu >= 85 or memory >= 85 or disk >= 90:

        return {
            "status": "Anomaly",
            "prediction": -1,
            "score": -1.0
        }

    # -------------------------------------
    # Model not trained
    # -------------------------------------

    if not os.path.exists(MODEL_PATH):

        return {
            "status": "Normal",
            "prediction": 1,
            "score": 0.0
        }

    model = joblib.load(MODEL_PATH)

    sample = pd.DataFrame([{

        "cpu": cpu,

        "memory": memory,

        "disk": disk,

        "network_sent": metrics.get("network_sent", 0),

        "network_received": metrics.get("network_received", 0),

        "processes": metrics.get("processes", 0)

    }])[FEATURES]

    prediction = int(model.predict(sample)[0])

    score = float(model.decision_function(sample)[0])

    # -------------------------------------
    # Verify AI prediction
    # -------------------------------------

    if prediction == -1:

        if cpu >= 70 or memory >= 70 or disk >= 80:

            status = "Anomaly"

        else:

            status = "Normal"

            prediction = 1

    else:

        status = "Normal"

    return {

        "status": status,

        "prediction": prediction,

        "score": round(score, 4)

    }