import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

function Map() {
  const roads = [
    {
      name: "Tunis Centre Road",
      congestion: 82,
      level: "High",
      positions: [
        [36.8120, 10.1700],
        [36.8085, 10.1780],
        [36.8065, 10.1815],
        [36.8040, 10.1870],
      ],
    },
    {
      name: "Lac 1 Road",
      congestion: 54,
      level: "Medium",
      positions: [
        [36.8320, 10.2200],
        [36.8328, 10.2280],
        [36.8328, 10.2357],
      ],
    },
    {
      name: "Ariana Road",
      congestion: 37,
      level: "Low",
      positions: [
        [36.8600, 10.1550],
        [36.8663, 10.1647],
        [36.8720, 10.1720],
      ],
    },
    {
      name: "Ben Arous Road",
      congestion: 71,
      level: "High",
      positions: [
        [36.7600, 10.2150],
        [36.7531, 10.2289],
        [36.7480, 10.2380],
      ],
    },
  ]

  const getRoadColor = (congestion) => {
    if (congestion >= 70) {
      return "red"
    }

    if (congestion >= 50) {
      return "orange"
    }

    return "green"
  }

  return (
    <MapContainer
      center={[36.8065, 10.1815]}
      zoom={12}
      style={{ height: "420px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {roads.map((road) => (
        <Polyline
          key={road.name}
          positions={road.positions}
          pathOptions={{
            color: getRoadColor(road.congestion),
            weight: 7,
            opacity: 0.9,
          }}
        >
          <Popup>
            <strong>{road.name}</strong>
            <br />
            Congestion: {road.congestion}%
            <br />
            Level: {road.level}
          </Popup>
        </Polyline>
      ))}
    </MapContainer>
  )
}

export default Map