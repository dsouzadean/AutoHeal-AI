"""
AI Anomaly Detection
"""

import joblib
import os

import pandas as pd

from sklearn.ensemble import IsolationForest

MODEL_PATH = "models/anomaly_model.pkl"


def train_model(dataframe):

    features = dataframe[[
        "cpu",
        "memory",
        "disk",
        "processes"
    ]]

    model = IsolationForest(

        contamination=0.05,
        random_state=42

    )

    model.fit(features)

    os.makedirs("models", exist_ok=True)

    joblib.dump(model, MODEL_PATH)

    print("✅ Anomaly Detection Model Trained")


def detect_anomaly(metrics):

    if not os.path.exists(MODEL_PATH):

        return {

            "status": "Model Not Trained",
            "prediction": 0

        }

    model = joblib.load(MODEL_PATH)

    sample = pd.DataFrame([{

        "cpu": metrics["cpu"],
        "memory": metrics["memory"],
        "disk": metrics["disk"],
        "processes": metrics["processes"]

    }])

    prediction = model.predict(sample)[0]

    if prediction == -1:

        return {

            "status": "Anomaly",

            "prediction": prediction

        }

    return {

        "status": "Normal",

        "prediction": prediction

    }