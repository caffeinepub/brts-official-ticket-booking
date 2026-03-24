import L from "leaflet";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { stationCoords } from "@/data/trains";

// Fix default icon
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
  iconAnchor: [12, 41],
  iconSize: [25, 41],
  popupAnchor: [1, -34],
});

interface RouteMapProps {
  from: string;
  to: string;
}

export default function RouteMap({ from, to }: RouteMapProps) {
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  const fromCoord = stationCoords[from];
  const toCoord = stationCoords[to];

  if (!fromCoord || !toCoord) return null;

  const center: [number, number] = [
    (fromCoord[0] + toCoord[0]) / 2,
    (fromCoord[1] + toCoord[1]) / 2,
  ];

  return (
    <div
      className="rounded-xl overflow-hidden border border-border shadow-sm"
      style={{ height: 300 }}
    >
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={fromCoord} icon={DefaultIcon}>
          <Popup>{from}</Popup>
        </Marker>
        <Marker position={toCoord} icon={DefaultIcon}>
          <Popup>{to}</Popup>
        </Marker>
        <Polyline
          positions={[fromCoord, toCoord]}
          pathOptions={{ color: "#1a56db", weight: 3, dashArray: "8 4" }}
        />
      </MapContainer>
    </div>
  );
}
