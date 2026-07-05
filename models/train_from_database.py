"""
Train Failure Prediction Model
using Real System Metrics
"""

from pathlib import Path

import joblib

from sklearn.ensemble import RandomForestClassifier

from database.database import SessionLocal
from database.models import SystemMetrics

MODEL_PATH = Path(__file__).parent / "failure_model.pkl"


def load_training_data():

    session = SessionLocal()

    rows = (

        session.query(SystemMetrics)

        .all()

    )

    X = []

    y = []

    for row in rows:

        cpu = row.cpu

        memory = row.memory

        disk = row.disk

        processes = row.processes

        X.append([

            cpu,

            memory,

            disk,

            processes

        ])

        # Generate labels
        # (Later we will replace this with
        # actual incident data.)

        if (

            cpu > 90

            or memory > 90

            or disk > 95

            or processes > 320

        ):

            label = 1

        else:

            label = 0

        y.append(label)

    session.close()

    return X, y


def train():

    X, y = load_training_data()

    if len(X) < 100:

        print("Not enough training data.")

        return

    model = RandomForestClassifier(

        n_estimators=300,

        random_state=42

    )

    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)

    print("Model trained using", len(X), "real metrics.")


if __name__ == "__main__":

    train()