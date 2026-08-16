import { useEffect, useState } from "react";
import "./prediction.css";

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

function Predictions() {
  const [selected, setSelected] = useState("tunis");
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch("https://tuniflow-gi60.onrender.com/roads/tunis").then((response) => {
        if (!response.ok) {
          throw new Error("Prediction request failed");
        }

        return response.json();
      }),

      fetch(
        `https://tuniflow-gi60.onrender.com/traffic-history/${selected}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error("History request failed");
        }

        return response.json();
      }),
    ])
      .then(([predictionData, historyData]) => {
        setPrediction(predictionData.prediction);
        setHistory(historyData.history || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);

        setPrediction(null);
        setHistory([]);
        setLoading(false);
      });
  }, [selected]);

  const predictionValue =
    prediction?.prediction ?? 0;

  const maxHistory = Math.max(
    ...history.map((item) => item.congestion),
    100
  );

  return (
    <main className="predictions-page">

      {/* HEADER */}

      <section className="prediction-header">

        <div>
          <div className="prediction-label">
            🇹🇳 TUNIFLOW • PREDICTIVE INTELLIGENCE
          </div>

          <h1>Traffic Predictions</h1>

          <p>
            Analyze recent traffic behavior and
            estimate upcoming congestion.
          </p>
        </div>

        <div className="prediction-selector">

          <label htmlFor="prediction-governorate">
            Governorate
          </label>

          <select
            id="prediction-governorate"
            value={selected}
            onChange={(event) =>
              setSelected(event.target.value)
            }
          >
            {governorates.map(([id, name]) => (
              <option
                key={id}
                value={id}
              >
                {name}
              </option>
            ))}
          </select>

        </div>

      </section>

      {/* PREDICTION CARDS */}

      <section className="prediction-grid">

        <div className="prediction-card">

          <div className="prediction-top">

            <div>
              <span>
                Predicted congestion
              </span>

              <h2>
                {loading
                  ? "..."
                  : `${predictionValue}%`}
              </h2>
            </div>

            {!loading && prediction && (
              <div
                className={`prediction-badge ${prediction.status}`}
              >
                {prediction.status}
              </div>
            )}

          </div>

          <div className="prediction-meter">

            <div
              className={`prediction-meter-fill ${
                prediction?.status || ""
              }`}
              style={{
                width: `${predictionValue}%`,
              }}
            />

          </div>

          <div className="prediction-message">

            {loading
              ? "Analyzing traffic..."
              : prediction?.status === "heavy"
              ? "Heavy traffic is expected."
              : prediction?.status === "moderate"
              ? "Moderate traffic is expected."
              : "Traffic is expected to remain low."}

          </div>

        </div>

        {/* CONFIDENCE */}

        <div className="prediction-small-card">

          <span>
            Confidence
          </span>

          <strong>
            {loading
              ? "..."
              : `${prediction?.confidence || 0}%`}
          </strong>

          <p>
            Confidence based on the amount of
            available historical observations.
          </p>

        </div>

        {/* OBSERVATIONS */}

        <div className="prediction-small-card">

          <span>
            Observations
          </span>

          <strong>
            {loading
              ? "..."
              : prediction?.observations_used || 0}
          </strong>

          <p>
            Recent traffic measurements used by
            the prediction engine.
          </p>

        </div>

      </section>

      {/* HISTORY */}

      <section className="history-card">

        <div className="history-header">

          <div>
            <h2>
              Recent Traffic History
            </h2>

            <p>
              Congestion observations for the
              selected governorate.
            </p>
          </div>

          <div className="history-count">
            {history.length} observations
          </div>

        </div>

        {history.length === 0 ? (

          <div className="empty-history">
            No historical data yet.
          </div>

        ) : (

          <div className="history-chart">

            {history
              .slice()
              .reverse()
              .map((item, index) => {

                const height =
                  (item.congestion /
                    maxHistory) *
                  100;

                return (
                  <div
                    className="history-column"
                    key={`${item.id}-${index}`}
                  >

                    <div
                      className={`history-bar ${item.status}`}
                      style={{
                        height: `${Math.max(
                          height,
                          5
                        )}%`,
                      }}
                      title={`${item.congestion}% congestion`}
                    />

                    <span>
                      {item.congestion}%
                    </span>

                  </div>
                );
              })}

          </div>

        )}

      </section>

      {/* PIPELINE */}

      <section className="prediction-explanation">

        <h2>
          Prediction pipeline
        </h2>

        <div className="prediction-steps">

          <div>
            <span>01</span>

            <h3>
              Collect
            </h3>

            <p>
              Traffic observations are stored
              in the TuniFlow database.
            </p>
          </div>

          <div>
            <span>02</span>

            <h3>
              Analyze
            </h3>

            <p>
              Recent observations receive
              greater importance.
            </p>
          </div>

          <div>
            <span>03</span>

            <h3>
              Predict
            </h3>

            <p>
              The system estimates the upcoming
              congestion level.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Predictions;