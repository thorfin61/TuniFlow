  import { useEffect, useState } from "react";
  import {
    MapContainer,
    TileLayer,
    Polyline,
    Popup,
  } from "react-leaflet";

  import "leaflet/dist/leaflet.css";
  import "./App.css";

  import Analytics from "./analytics";
  import Predictions from "./prediction";
  const governorates = {
    tunis: {
      name: "Tunis",
      center: [36.8065, 10.1815],
      zoom: 12,
    },

    ariana: {
      name: "Ariana",
      center: [36.8665, 10.1647],
      zoom: 12,
    },

    "ben-arous": {
      name: "Ben Arous",
      center: [36.7531, 10.2189],
      zoom: 12,
    },

    manouba: {
      name: "Manouba",
      center: [36.8101, 10.0956],
      zoom: 12,
    },

    nabeul: {
      name: "Nabeul",
      center: [36.4513, 10.7357],
      zoom: 12,
    },

    zaghouan: {
      name: "Zaghouan",
      center: [36.4029, 10.1429],
      zoom: 12,
    },

    bizerte: {
      name: "Bizerte",
      center: [37.2744, 9.8739],
      zoom: 12,
    },

    beja: {
      name: "Béja",
      center: [36.7256, 9.1817],
      zoom: 12,
    },

    jendouba: {
      name: "Jendouba",
      center: [36.5011, 8.7802],
      zoom: 12,
    },

    kef: {
      name: "Le Kef",
      center: [36.1742, 8.7049],
      zoom: 12,
    },

    siliana: {
      name: "Siliana",
      center: [36.0849, 9.3708],
      zoom: 12,
    },

    sousse: {
      name: "Sousse",
      center: [35.8256, 10.63699],
      zoom: 12,
    },

    monastir: {
      name: "Monastir",
      center: [35.7643, 10.8113],
      zoom: 12,
    },

    mahdia: {
      name: "Mahdia",
      center: [35.5047, 11.0622],
      zoom: 12,
    },

    sfax: {
      name: "Sfax",
      center: [34.7406, 10.7603],
      zoom: 12,
    },

    kairouan: {
      name: "Kairouan",
      center: [35.6781, 10.0963],
      zoom: 12,
    },

    kasserine: {
      name: "Kasserine",
      center: [35.1676, 8.8365],
      zoom: 12,
    },

    "sidi-bouzid": {
      name: "Sidi Bouzid",
      center: [35.0382, 9.4858],
      zoom: 12,
    },

    gabes: {
      name: "Gabès",
      center: [33.8815, 10.0982],
      zoom: 12,
    },

    medenine: {
      name: "Medenine",
      center: [33.3549, 10.5055],
      zoom: 12,
    },

    tataouine: {
      name: "Tataouine",
      center: [32.9297, 10.4518],
      zoom: 12,
    },

    gafsa: {
      name: "Gafsa",
      center: [34.425, 8.7842],
      zoom: 12,
    },

    tozeur: {
      name: "Tozeur",
      center: [33.9197, 8.1335],
      zoom: 12,
    },

    kebili: {
      name: "Kebili",
      center: [33.7044, 8.969],
      zoom: 12,
    },
  };

  function Dashboard() {
    const [governorate, setGovernorate] = useState("tunis");

    const [roads, setRoads] = useState([]);

    const [traffic, setTraffic] = useState(null);

    const [loadingRoads, setLoadingRoads] =
      useState(false);

    const [loadingTraffic, setLoadingTraffic] =
      useState(false);

    const [error, setError] = useState(null);

    useEffect(() => {
      setLoadingRoads(true);

      setError(null);

      setRoads([]);

      fetch("https://tuniflow-gi60.onrender.com/roads/tunis")
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Failed to load road data"
            );
          }

          return response.json();
        })
        .then((data) => {
          setRoads(data.roads || []);
          setLoadingRoads(false);
        })
        .catch((err) => {
          console.error(err);

          setError(err.message);

          setLoadingRoads(false);
        });
    }, [governorate]);

    useEffect(() => {
      setLoadingTraffic(true);

      setTraffic(null);

      fetch(
        `https://tuniflow-gi60.onrender.com/traffic/${governorate}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Failed to load traffic data"
            );
          }

          return response.json();
        })
        .then((data) => {
          setTraffic(data.traffic);

          setLoadingTraffic(false);
        })
        .catch((err) => {
          console.error(err);

          setLoadingTraffic(false);
        });
    }, [governorate]);

    const getRoadColor = (road) => {
      const value = road.id % 100;

      if (value < 35) {
        return "#22c55e";
      }

      if (value < 70) {
        return "#f59e0b";
      }

      return "#ef4444";
    };

    const currentGovernorate =
      governorates[governorate];

    return (
      <main className="dashboard">

        <section className="hero">

          <div className="hero-label">
            🇹🇳 TUNISIA • URBAN MOBILITY
          </div>

          <h1>
            Traffic Intelligence
          </h1>

          <p>
            Monitor traffic conditions, analyze
            congestion and understand mobility
            across all 24 Tunisian governorates.
          </p>

          <div className="city-control">

            <label htmlFor="governorate">
              Governorate
            </label>

            <select
              id="governorate"
              value={governorate}
              onChange={(event) =>
                setGovernorate(
                  event.target.value
                )
              }
            >
              {Object.entries(
                governorates
              ).map(([key, value]) => (
                <option
                  key={key}
                  value={key}
                >
                  {value.name}
                </option>
              ))}
            </select>

          </div>

        </section>

        <section className="stats">

          <div className="stat-card">

            <div className="stat-title">
              Current Traffic
            </div>

            <div className="stat-value">
              {loadingTraffic
                ? "..."
                : traffic
                ? `${traffic.congestion}%`
                : "—"}
            </div>

            <div className="stat-description">
              {traffic
                ? `${traffic.status} congestion`
                : "Waiting for traffic data"}
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-title">
              Roads Monitored
            </div>

            <div className="stat-value">
              {roads.length.toLocaleString()}
            </div>

            <div className="stat-description">
              OpenStreetMap road segments
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-title">
              Average Speed
            </div>

            <div className="stat-value">
              {traffic
                ? `${traffic.average_speed} km/h`
                : "—"}
            </div>

            <div className="stat-description">
              Current traffic estimate
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-title">
              Coverage
            </div>

            <div className="stat-value">
              24
            </div>

            <div className="stat-description">
              Tunisian governorates
            </div>

          </div>

        </section>

        <section className="map-section">

          <div className="map-header">

            <div className="map-title">
              Traffic Map —{" "}
              {currentGovernorate.name}
            </div>

            <div className="status">

              <div className="status-dot"></div>

              System online

            </div>

          </div>

          <div className="map-container">

            {loadingRoads && (
              <div className="loading">
                Loading{" "}
                {currentGovernorate.name}
                roads...
              </div>
            )}

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <MapContainer
              key={governorate}
              center={
                currentGovernorate.center
              }
              zoom={
                currentGovernorate.zoom
              }
              style={{
                height: "100%",
                width: "100%",
              }}
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {roads.map((road) => (
                <Polyline
                  key={road.id}
                  positions={
                    road.coordinates
                  }
                  pathOptions={{
                    color:
                      getRoadColor(road),
                    weight: 4,
                  }}
                >
                  <Popup>

                    <strong>
                      {road.name}
                    </strong>

                    <br />

                    Type: {road.type}

                  </Popup>
                </Polyline>
              ))}

            </MapContainer>

            <div className="legend">

              <div className="legend-title">
                Traffic level
              </div>

              <div className="legend-item">

                <div
                  className="legend-color"
                  style={{
                    background:
                      "#22c55e",
                  }}
                />

                Low

              </div>

              <div className="legend-item">

                <div
                  className="legend-color"
                  style={{
                    background:
                      "#f59e0b",
                  }}
                />

                Moderate

              </div>

              <div className="legend-item">

                <div
                  className="legend-color"
                  style={{
                    background:
                      "#ef4444",
                  }}
                />

                Heavy

              </div>

            </div>

          </div>

        </section>

      </main>
    );
  }

  function App() {
    const [page, setPage] =
      useState("dashboard");

    return (
      <div className="app">

        <header className="header">

          <div className="logo">

            <span className="logo-icon">
              🚦
            </span>

            Tuni<span>Flow</span>

          </div>

          <nav className="nav">

            <button
              className={
                page === "dashboard"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() =>
                setPage("dashboard")
              }
            >
              Dashboard
            </button>

            <button
              className={
                page === "analytics"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() =>
                setPage("analytics")
              }
            >
              Analytics
            </button>

            <button
              className={
                page === "predictions"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() =>
                setPage("predictions")
              }
            >
              Predictions
            </button>

          </nav>

        </header>

        {page === "dashboard" && (
          <Dashboard />
        )}

        {page === "analytics" && (
          <Analytics />
        )}

        {page === "predictions" && (
          <Predictions />
        )}

      </div>
    );
  }

  export default App;