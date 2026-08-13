import sqlite3
import random
from datetime import datetime, timedelta

DB = "tuniflow.db"

governorates = [
    "tunis", "ariana", "ben-arous", "manouba",
    "nabeul", "zaghouan", "bizerte", "beja",
    "jendouba", "kef", "siliana", "sousse",
    "monastir", "mahdia", "kairouan", "kasserine",
    "sidi-bouzid", "sfax", "gabes", "medenine",
    "tataouine", "gafsa", "tozeur", "kebili"
]

conn = sqlite3.connect(DB)
cursor = conn.cursor()

print("Database connected.")

columns = cursor.execute(
    "PRAGMA table_info(traffic_history)"
).fetchall()

column_names = [column[1] for column in columns]

print("Traffic history columns:")
print(column_names)


def status_from_congestion(value):
    if value < 35:
        return "low"
    elif value < 70:
        return "moderate"
    return "heavy"


inserted = 0

for governorate in governorates:

    for i in range(20):

        congestion = random.randint(15, 85)

        speed = max(
            15,
            round(
                70
                - congestion * 0.45
                + random.uniform(-5, 5)
            )
        )

        status = status_from_congestion(
            congestion
        )

        timestamp = (
            datetime.now()
            - timedelta(hours=20 - i)
        ).isoformat()

        values = {}

        if "governorate" in column_names:
            values["governorate"] = governorate

        if "congestion" in column_names:
            values["congestion"] = congestion

        if "average_speed" in column_names:
            values["average_speed"] = speed

        if "status" in column_names:
            values["status"] = status

        if "timestamp" in column_names:
            values["timestamp"] = timestamp

        if "created_at" in column_names:
            values["created_at"] = timestamp

        if not values:
            print("No compatible columns found.")
            conn.close()
            raise SystemExit

        column_sql = ", ".join(values.keys())

        placeholder_sql = ", ".join(
            ["?"] * len(values)
        )

        sql = f"""
        INSERT INTO traffic_history
        ({column_sql})
        VALUES ({placeholder_sql})
        """

        cursor.execute(
            sql,
            list(values.values())
        )

        inserted += 1


conn.commit()
conn.close()

print()
print("==============================")
print("DATA SEEDING COMPLETE")
print("==============================")
print(f"Inserted: {inserted} observations")
print("==============================")