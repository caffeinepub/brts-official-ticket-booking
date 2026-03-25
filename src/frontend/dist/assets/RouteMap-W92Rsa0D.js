import { r as reactExports, s as stationCoords, j as jsxRuntimeExports } from "./index-CGbMxLQp.js";
function ensureLeafletLoaded() {
  return new Promise((resolve) => {
    if (window.L) {
      resolve();
      return;
    }
    if (!document.querySelector("link[data-leaflet-css]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.setAttribute("data-leaflet-css", "1");
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}
function RouteMap({ from, to }) {
  const mapRef = reactExports.useRef(null);
  const mapInstanceRef = reactExports.useRef(null);
  const fromCoord = stationCoords[from];
  const toCoord = stationCoords[to];
  reactExports.useEffect(() => {
    if (!fromCoord || !toCoord || !mapRef.current) return;
    let destroyed = false;
    ensureLeafletLoaded().then(() => {
      if (destroyed || !mapRef.current) return;
      const L = window.L;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      const center = [
        (fromCoord[0] + toCoord[0]) / 2,
        (fromCoord[1] + toCoord[1]) / 2
      ];
      const map = L.map(mapRef.current, { scrollWheelZoom: false }).setView(
        center,
        8
      );
      mapInstanceRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconAnchor: [12, 41],
        iconSize: [25, 41],
        popupAnchor: [1, -34]
      });
      L.marker(fromCoord, { icon }).addTo(map).bindPopup(from).openPopup();
      L.marker(toCoord, { icon }).addTo(map).bindPopup(to);
      L.polyline([fromCoord, toCoord], {
        color: "#1a56db",
        weight: 3,
        dashArray: "8 4"
      }).addTo(map);
    });
    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [from, to, fromCoord, toCoord]);
  if (!fromCoord || !toCoord) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: mapRef,
      className: "rounded-xl overflow-hidden border border-border shadow-sm",
      style: { height: 300 }
    }
  );
}
export {
  RouteMap as default
};
