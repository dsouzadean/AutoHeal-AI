"""
Prediction History Storage
"""

import sqlite3

DATABASE = "autoheal.db"


def initialize_prediction_table():

    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute("""

        CREATE TABLE IF NOT EXISTS prediction_history(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

            cpu REAL,

            memory REAL,

            disk REAL,

            processes INTEGER,

            probability REAL,

            confidence REAL,

            risk TEXT

        )

    """)

    conn.commit()

    conn.close()


def save_prediction(metrics, prediction):

    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute("""

        INSERT INTO prediction_history(

            cpu,

            memory,

            disk,

            processes,

            probability,

            confidence,

            risk

        )

        VALUES(?,?,?,?,?,?,?)

    """, (

        metrics["cpu"],

        metrics["memory"],

        metrics["disk"],

        metrics["processes"],

        prediction["failure_probability"],

        prediction["confidence"],

        prediction["risk"]

    ))

    conn.commit()

    conn.close()


def load_recent_predictions(limit=100):

    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute("""

        SELECT

            cpu,

            memory,

            disk,

            processes,

            probability,

            confidence,

            risk

        FROM prediction_history

        ORDER BY id DESC

        LIMIT ?

    """,(limit,))

    rows = cursor.fetchall()

    conn.close()

    return rows