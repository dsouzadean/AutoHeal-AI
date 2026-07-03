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
    Train Isolation Forest using historical system metrics.
    """

    if dataframe.empty:
        raise ValueError("No training data available.")

    missing = [col for col in FEATURES if col not in dataframe.columns]

    if missing:
        raise ValueError(f"Missing columns: {missing}")

    training_data = dataframe[FEATURES]

    model = IsolationForest(
        contamination=0.05,
        random_state=42,
        n_estimators=100
    )

    model.fit(training_data)

    os.makedirs("models", exist_ok=True)

    joblib.dump(model, MODEL_PATH)

    print("✅ AI Anomaly Detection Model Trained Successfully")


def detect_anomaly(metrics):
    """
    Detect anomalies using the trained Isolation Forest model.
    """

    if not os.path.exists(MODEL_PATH):
        return {
            "status": "Model Not Trained",
            "prediction": 0,
            "score": 0.0
        }

    model = joblib.load(MODEL_PATH)

    sample = pd.DataFrame([{
        "cpu": metrics.get("cpu", 0),
        "memory": metrics.get("memory", 0),
        "disk": metrics.get("disk", 0),
        "network_sent": metrics.get("network_sent", 0),
        "network_received": metrics.get("network_received", 0),
        "processes": metrics.get("processes", 0)
    }])[FEATURES]

    prediction = int(model.predict(sample)[0])

    score = float(model.decision_function(sample)[0])

    if prediction == -1:
        status = "Anomaly"
    else:
        status = "Normal"

    return {
        "status": status,
        "prediction": prediction,
        "score": round(score, 4)
    }