import { useEffect, useState } from "react";
import "./analytics.css";

const governorates = [
  ["tunis", "Tunis"],
  ["ariana", "Ariana"],
  ["ben-arous", "Ben Arous"],
  ["manouba", "Manouba"],
  ["nabeul", "Nabeul"],
  ["zaghouan", "Zaghouan"],
  ["bizerte", "Bizerte"],
  ["beja", "Béja"],
  ["jendouba", "Jendouba"],
  ["kef", "Le Kef"],
  ["siliana", "Siliana"],
  ["sousse", "Sousse"],
  ["monastir", "Monastir"],
  ["mahdia", "Mahdia"],
  ["kairouan", "Kairouan"],
  ["kasserine", "Kasserine"],
  ["sidi-bouzid", "Sidi Bouzid"],
  ["sfax", "Sfax"],
  ["gabes", "Gabès"],
  ["medenine", "Medenine"],
  ["tataouine", "Tataouine"],
  ["gafsa", "Gafsa"],
  ["tozeur", "Tozeur"],
  ["kebili", "Kebili"],
];

function Analytics() {
  const [selected, setSelected] = useState("tunis");
  const [traffic, setTraffic] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(
        `https://tuniflow-gi60.onrender.com/traffic/${selected}`
      ).then((res) => res.json()),

      fetch(
        `https://tuniflow-gi60.onrender.com/traffic-history/${selected}`
      ).then((res) => res.json()),
    ])
      .then(([trafficData, historyData]) => {
        setTraffic(trafficData.traffic);
        setHistory(historyData.history || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [selected]);

  const values = history.map(
    (item) => item.congestion
  );

  const average =
    values.length > 0
      ? Math.round(
          values.reduce(
            (sum, value) => sum + value,
            0
          ) / values.length
        )
      : traffic?.congestion || 0;

  const highest =
    values.length > 0
      ? Math.max(...values)
      : traffic?.congestion || 0;

  const lowest =
    values.length > 0
      ? Math.min(...values)
      : traffic?.congestion || 0;

  const maxChart = Math.max(
    ...values,
    100
  );

  return (
    <main className="analytics-page">

      <section className="analytics-header">

        <div>
          <div className="analytics-label">
            🇹🇳 TUNIFLOW • DATA ANALYTICS
          </div>

          <h1>Traffic Analytics</h1>

          <p>
            Analyze congestion patterns and
            mobility indicators for each
            Tunisian governorate.
          </p>
        </div>

        <div className="analytics-selector">

          <label>
            Governorate
          </label>

          <select
            value={selected}
            onChange={(event) =>
              setSelected(event.target.value)
            }
          >
            {governorates.map(
              ([id, name]) => (
                <option
                  key={id}
                  value={id}
                >
                  {name}
                </option>
              )
            )}
          </select>

        </div>

      </section>

      <section className="analytics-stats">

        <div className="analytics-stat">

          <span>Average congestion</span>

          <strong>
            {loading
              ? "..."
              : `${average}%`}
          </strong>

          <small>
            Historical average
          </small>

        </div>

        <div className="analytics-stat">

          <span>Highest congestion</span>

          <strong>
            {loading
              ? "..."
              : `${highest}%`}
          </strong>

          <small>
            Maximum observed
          </small>

        </div>

        <div className="analytics-stat">

          <span>Lowest congestion</span>

          <strong>
            {loading
              ? "..."
              : `${lowest}%`}
          </strong>

          <small>
            Minimum observed
          </small>

        </div>

        <div className="analytics-stat">

          <span>Observations</span>

          <strong>
            {loading
              ? "..."
              : history.length}
          </strong>

          <small>
            Recorded measurements
          </small>

        </div>

      </section>

      <section className="analytics-chart-card">

        <div className="analytics-card-header">

          <div>
            <h2>
              Congestion trend
            </h2>

            <p>
              Recent congestion measurements
            </p>
          </div>

          <div className="analytics-status">
            {traffic?.status || "no data"}
          </div>

        </div>

        {history.length === 0 ? (

          <div className="analytics-empty">

            <strong>
              No historical observations yet
            </strong>

            <p>
              Load traffic data from the
              Dashboard to start building the
              analytics history.
            </p>

          </div>

        ) : (

          <div className="analytics-chart">

            {history.map(
              (item, index) => {

                const height =
                  (item.congestion /
                    maxChart) *
                  100;

                return (
                  <div
                    className="analytics-column"
                    key={`${item.id}-${index}`}
                  >

                    <span>
                      {item.congestion}%
                    </span>

                    <div
                      className={`analytics-bar ${item.status}`}
                      style={{
                        height: `${Math.max(
                          height,
                          4
                        )}%`,
                      }}
                    />

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>

      <section className="analytics-bottom">

        <div className="analytics-info-card">

          <h2>
            Current conditions
          </h2>

          <div className="condition-row">

            <span>
              Congestion
            </span>

            <strong>
              {traffic
                ? `${traffic.congestion}%`
                : "—"}
            </strong>

          </div>

          <div className="condition-row">

            <span>
              Average speed
            </span>

            <strong>
              {traffic
                ? `${traffic.average_speed} km/h`
                : "—"}
            </strong>

          </div>

          <div className="condition-row">

            <span>
              Status
            </span>

            <strong>
              {traffic?.status || "—"}
            </strong>

          </div>

        </div>

        <div className="analytics-info-card">

          <h2>
            Mobility insight
          </h2>

          <p className="insight">

            {average >= 70
              ? "Traffic conditions are currently heavy. Mobility may be significantly affected."
              : average >= 35
              ? "Traffic conditions are moderate. Some roads may experience noticeable congestion."
              : "Traffic conditions are relatively light based on the available observations."}

          </p>

          <div className="insight-note">
            Analysis is based on TuniFlow
            traffic observations.
          </div>

        </div>

      </section>

    </main>
  );
}

export default Analytics;