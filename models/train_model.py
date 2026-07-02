"""
Train AI Model
"""

import pandas as pd

from database.database import SessionLocal
from database.models import SystemMetrics

from ai.anomaly_detection import train_model

session = SessionLocal()

rows = session.query(SystemMetrics).all()

session.close()

dataset = []

for row in rows:

    dataset.append({

        "cpu": row.cpu,
        "memory": row.memory,
        "disk": row.disk,
        "processes": row.processes

    })

df = pd.DataFrame(dataset)

print(df.head())

train_model(df)