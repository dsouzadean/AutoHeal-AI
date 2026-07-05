"""
Train Failure Prediction Model
"""

import joblib
import random

from sklearn.ensemble import RandomForestClassifier

MODEL_PATH = "models/failure_model.pkl"


def generate_training_data(samples=5000):

    X = []
    y = []

    for _ in range(samples):

        cpu = random.uniform(0,100)
        memory = random.uniform(0,100)
        disk = random.uniform(0,100)
        processes = random.randint(50,400)

        failure = 0

        if (
            cpu > 90
            or memory > 90
            or disk > 95
            or processes > 320
        ):
            failure = 1

        X.append([
            cpu,
            memory,
            disk,
            processes
        ])

        y.append(failure)

    return X,y


def train():

    X,y = generate_training_data()

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42
    )

    model.fit(X,y)

    joblib.dump(model,MODEL_PATH)

    print("Failure Prediction Model Saved.")


if __name__=="__main__":

    train()