from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from datetime import datetime
from collections import defaultdict

app = FastAPI(
    title="TuniFlow API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# 24 TUNISIAN GOVERNORATES
# =========================================================

GOVERNORATES = {
    "tunis": {
        "name": "Tunis",
        "lat": 36.8065,
        "lon": 10.1815,
    },
    "ariana": {
        "name": "Ariana",
        "lat": 36.8663,
        "lon": 10.1647,
    },
    "ben-arous": {
        "name": "Ben Arous",
        "lat": 36.7531,
        "lon": 10.2282,
    },
    "manouba": {
        "name": "Manouba",
        "lat": 36.8081,
        "lon": 10.0962,
    },
    "nabeul": {
        "name": "Nabeul",
        "lat": 36.4513,
        "lon": 10.7357,
    },
    "zaghouan": {
        "name": "Zaghouan",
        "lat": 36.4029,
        "lon": 10.1429,
    },
    "bizerte": {
        "name": "Bizerte",
        "lat": 37.2744,
        "lon": 9.8739,
    },
    "beja": {
        "name": "Beja",
        "lat": 36.7256,
        "lon": 9.1817,
    },
    "jendouba": {
        "name": "Jendouba",
        "lat": 36.5011,
        "lon": 8.7802,
    },
    "kef": {
        "name": "Le Kef",
        "lat": 36.1742,
        "lon": 8.7049,
    },
    "siliana": {
        "name": "Siliana",
        "lat": 36.0849,
        "lon": 9.3708,
    },
    "sousse": {
        "name": "Sousse",
        "lat": 35.8256,
        "lon": 10.63699,
    },
    "monastir": {
        "name": "Monastir",
        "lat": 35.7643,
        "lon": 10.8113,
    },
    "mahdia": {
        "name": "Mahdia",
        "lat": 35.5047,
        "lon": 11.0622,
    },
    "kairouan": {
        "name": "Kairouan",
        "lat": 35.6781,
        "lon": 10.0963,
    },
    "kasserine": {
        "name": "Kasserine",
        "lat": 35.1676,
        "lon": 8.8365,
    },
    "sidi-bouzid": {
        "name": "Sidi Bouzid",
        "lat": 35.0382,
        "lon": 9.4858,
    },
    "sfax": {
        "name": "Sfax",
        "lat": 34.7406,
        "lon": 10.7603,
    },
    "gabes": {
        "name": "Gabes",
        "lat": 33.8815,
        "lon": 10.0982,
    },
    "medenine": {
        "name": "Medenine",
        "lat": 33.3549,
        "lon": 10.5055,
    },
    "tataouine": {
        "name": "Tataouine",
        "lat": 32.9297,
        "lon": 10.4518,
    },
    "gafsa": {
        "name": "Gafsa",
        "lat": 34.425,
        "lon": 8.7842,
    },
    "tozeur": {
        "name": "Tozeur",
        "lat": 33.9197,
        "lon": 8.1335,
    },
    "kebili": {
        "name": "Kebili",
        "lat": 33.7044,
        "lon": 8.969,
    },
}


# =========================================================
# TRAFFIC DATA
# =========================================================

TRAFFIC_DATA = {}

for governorate_id in GOVERNORATES:
    TRAFFIC_DATA[governorate_id] = {
        "congestion": 0,
        "average_speed": 0,
        "status": "no_data",
    }


# =========================================================
# TRAFFIC HISTORY
# =========================================================

TRAFFIC_HISTORY = defaultdict(list)


def save_traffic_observation(governorate, traffic):
    """
    Store a traffic observation in memory.

    This is currently an in-memory prototype.
    A database can replace this later.
    """

    observation = {
        "id": len(TRAFFIC_HISTORY[governorate]) + 1,
        "timestamp": datetime.now().isoformat(),
        "congestion": traffic["congestion"],
        "average_speed": traffic["average_speed"],
        "status": traffic["status"],
    }

    TRAFFIC_HISTORY[governorate].append(
        observation
    )

    # Keep only the latest 50 observations
    if len(TRAFFIC_HISTORY[governorate]) > 50:
        TRAFFIC_HISTORY[governorate] = (
            TRAFFIC_HISTORY[governorate][-50:]
        )


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "project": "TuniFlow",
        "message": "Tunisia-wide Traffic Intelligence API is running",
        "governorates": 24,
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "governorates": 24,
    }


# =========================================================
# GOVERNORATES
# =========================================================

@app.get("/governorates")
def get_governorates():
    return {
        "count": len(GOVERNORATES),
        "governorates": GOVERNORATES,
    }


# =========================================================
# TRAFFIC
# =========================================================

@app.get("/traffic/{governorate}")
def get_traffic(governorate: str):

    governorate = governorate.lower()

    if governorate not in GOVERNORATES:
        return {
            "error": "Governorate not supported",
            "available_governorates": list(
                GOVERNORATES.keys()
            ),
        }

    traffic = TRAFFIC_DATA[governorate]

    # Save an observation when actual traffic
    # data exists.
    if traffic["status"] != "no_data":
        save_traffic_observation(
            governorate,
            traffic
        )

    return {
        "governorate": governorate,
        "name": GOVERNORATES[governorate]["name"],
        "traffic": traffic,
    }


# =========================================================
# TRAFFIC HISTORY
# =========================================================

@app.get("/traffic-history/{governorate}")
def get_traffic_history(governorate: str):

    import sqlite3

    governorate = governorate.lower()

    if governorate not in GOVERNORATES:
        return {
            "error": "Governorate not supported",
            "available_governorates": list(
                GOVERNORATES.keys()
            ),
        }

    conn = sqlite3.connect("tuniflow.db")
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    rows = cursor.execute(
        """
        SELECT
            id,
            governorate,
            timestamp,
            congestion,
            average_speed,
            status
        FROM traffic_history
        WHERE LOWER(governorate) = ?
        ORDER BY timestamp ASC
        """,
        (governorate,)
    ).fetchall()

    conn.close()

    history = []

    for row in rows:
        history.append({
            "id": row["id"],
            "governorate": row["governorate"],
            "timestamp": row["timestamp"],
            "congestion": row["congestion"],
            "average_speed": row["average_speed"],
            "status": row["status"],
        })

    return {
        "governorate": governorate,
        "name": GOVERNORATES[governorate]["name"],
        "count": len(history),
        "history": history,
    }
# =========================================================
# PREDICTION
# =========================================================

@app.get("/prediction/{governorate}")
def get_prediction(governorate: str):

    governorate = governorate.lower()

    if governorate not in GOVERNORATES:
        return {
            "error": "Governorate not supported",
            "available_governorates": list(
                GOVERNORATES.keys()
            ),
        }

    history = TRAFFIC_HISTORY[governorate]

    # If there is no history, use current traffic
    # as the initial prediction.
    if not history:

        current = TRAFFIC_DATA[governorate]

        congestion = current["congestion"]

        if current["status"] == "no_data":
            congestion = 0

        return {
            "governorate": governorate,
            "name": GOVERNORATES[governorate]["name"],
            "prediction": {
                "prediction": round(congestion),
                "status": get_traffic_status(
                    congestion
                ),
                "confidence": 25,
                "observations_used": 0,
            },
        }

    # Use recent observations.
    recent = history[-10:]

    values = [
        item["congestion"]
        for item in recent
    ]

    # Weighted average:
    # recent observations have more importance.
    weights = range(1, len(values) + 1)

    weighted_sum = sum(
        value * weight
        for value, weight in zip(
            values,
            weights
        )
    )

    total_weight = sum(weights)

    prediction = (
        weighted_sum / total_weight
    )

    # Small trend adjustment.
    if len(values) >= 3:

        first_average = sum(
            values[:len(values)//2]
        ) / max(
            len(values)//2,
            1
        )

        second_average = sum(
            values[len(values)//2:]
        ) / max(
            len(values) - len(values)//2,
            1
        )

        trend = (
            second_average -
            first_average
        )

        prediction += trend * 0.25

    prediction = max(
        0,
        min(
            100,
            round(prediction)
        )
    )

    confidence = min(
        95,
        25 + len(values) * 7
    )

    return {
        "governorate": governorate,
        "name": GOVERNORATES[governorate]["name"],
        "prediction": {
            "prediction": prediction,
            "status": get_traffic_status(
                prediction
            ),
            "confidence": confidence,
            "observations_used": len(values),
        },
    }


# =========================================================
# TRAFFIC STATUS
# =========================================================

def get_traffic_status(congestion):

    if congestion < 35:
        return "low"

    if congestion < 70:
        return "moderate"

    return "heavy"


# =========================================================
# ROADS FROM OPENSTREETMAP
# =========================================================

@app.get("/roads/{governorate}")
def get_roads(governorate: str):

    governorate = governorate.lower()

    if governorate not in GOVERNORATES:
        return {
            "error": "Governorate not supported",
            "available_governorates": list(
                GOVERNORATES.keys()
            ),
        }

    center = GOVERNORATES[governorate]

    radius = 0.08

    south = center["lat"] - radius
    north = center["lat"] + radius
    west = center["lon"] - radius
    east = center["lon"] + radius

    query = f"""
    [out:json][timeout:60];

    way["highway"](
        {south},
        {west},
        {north},
        {east}
    );

    out geom;
    """

    overpass_servers = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.private.coffee/api/interpreter",
    ]

    data = None
    last_error = None

    for url in overpass_servers:

        try:

            response = requests.post(
                url,
                data={"data": query},
                headers={
                    "Accept": "application/json",
                    "User-Agent": (
                        "TuniFlow/0.1 "
                        "(educational traffic project)"
                    ),
                },
                timeout=90,
            )

            response.raise_for_status()

            data = response.json()

            break

        except requests.RequestException as error:

            last_error = error

            continue

    if data is None:
        return {
            "error": "Unable to retrieve road data",
            "details": str(last_error),
        }

    roads = []

    for road in data.get(
        "elements",
        []
    ):

        geometry = road.get(
            "geometry",
            []
        )

        if len(geometry) < 2:
            continue

        coordinates = []

        for point in geometry:

            coordinates.append(
                [
                    point["lat"],
                    point["lon"],
                ]
            )

        tags = road.get(
            "tags",
            {}
        )

        roads.append(
            {
                "id": road["id"],

                "name": tags.get(
                    "name",
                    "Unnamed road",
                ),

                "type": tags.get(
                    "highway",
                    "unknown",
                ),

                "coordinates": coordinates,
            }
        )

    return {
        "governorate": governorate,

        "name": GOVERNORATES[
            governorate
        ]["name"],

        "count": len(roads),

        "roads": roads,
    }