"""
AI Failure Prediction using Trained ML Model
"""

import joblib
from pathlib import Path

MODEL_PATH = Path(__file__).parent.parent / "models" / "failure_model.pkl"

model = joblib.load(MODEL_PATH)


def predict_failure(metrics):
    """
    Predict failure using trained Random Forest model.
    """

    cpu = float(metrics.get("cpu", 0))
    memory = float(metrics.get("memory", 0))
    disk = float(metrics.get("disk", 0))
    processes = int(metrics.get("processes", 0))

    features = [[

        cpu,

        memory,

        disk,

        processes

    ]]

    prediction = model.predict(features)[0]

    probability = model.predict_proba(features)[0][1]

    probability = round(probability * 100, 2)

    confidence = probability

    # =====================================
    # Risk Levels
    # =====================================

    if probability >= 90:

        risk = "CRITICAL"

        eta = 1

        recommendation = (
            "Immediate recovery required."
        )

    elif probability >= 70:

        risk = "HIGH"

        eta = 3

        recommendation = (
            "Prepare recovery."
        )

    elif probability >= 50:

        risk = "MEDIUM"

        eta = 8

        recommendation = (
            "Monitor carefully."
        )

    else:

        risk = "LOW"

        eta = 30

        recommendation = (
            "System healthy."
        )

    return {

        "prediction": int(prediction),

        "failure_probability": probability,

        "confidence": confidence,

        "estimated_time_minutes": eta,

        "risk": risk,

        "recommendation": recommendation

    }