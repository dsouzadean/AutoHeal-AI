"""
Train AI Model
"""

import pandas as pd

from database.database import SessionLocal
from database.models import SystemMetrics

from ai.anomaly_detection import train_model


def load_dataset():

    session = SessionLocal()

    rows = (
        session.query(SystemMetrics)
        .order_by(SystemMetrics.id.asc())
        .all()
    )

    session.close()

    dataset = []

    for row in rows:

        dataset.append(
            {
                "cpu": row.cpu,
                "memory": row.memory,
                "disk": row.disk,
                "network_sent": row.network_sent,
                "network_received": row.network_received,
                "processes": row.processes,
            }
        )

    return pd.DataFrame(dataset)


def main():

    df = load_dataset()

    print(f"Loaded {len(df)} records.")

    if df.empty:

        print("❌ No data found.")
        print("Run the dashboard for a few minutes first.")
        return

    train_model(df)

    print("✅ Model saved successfully.")
    print("Location: models/anomaly_model.pkl")


if __name__ == "__main__":
    main()