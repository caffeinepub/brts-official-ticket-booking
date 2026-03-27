// Type stubs for packages loaded via CDN / not installed as npm packages
declare module "leaflet" {
  const L: any;
  export default L;
  export const map: any;
  export const tileLayer: any;
  export const marker: any;
  export const polyline: any;
  export const icon: any;
  export const latLng: any;
  export const latLngBounds: any;
  export type LatLngExpression = any;
  export type Map = any;
}

declare module "react-leaflet" {
  export const MapContainer: any;
  export const TileLayer: any;
  export const Marker: any;
  export const Popup: any;
  export const Polyline: any;
  export const useMap: any;
}
