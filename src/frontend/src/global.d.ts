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

declare module "jspdf" {
  export class jsPDF {
    constructor(options?: any);
    text(text: string, x: number, y: number, options?: any): this;
    setFontSize(size: number): this;
    setFont(fontName: string, fontStyle?: string): this;
    setTextColor(r: number, g?: number, b?: number): this;
    setFillColor(r: number, g?: number, b?: number): this;
    setDrawColor(r: number, g?: number, b?: number): this;
    setLineWidth(width: number): this;
    rect(x: number, y: number, w: number, h: number, style?: string): this;
    line(x1: number, y1: number, x2: number, y2: number): this;
    save(filename: string): void;
    output(type: string): any;
    addPage(): this;
    internal: any;
    [key: string]: any;
  }
}
