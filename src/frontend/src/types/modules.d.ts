declare module "jsbarcode" {
  function JsBarcode(
    element: HTMLElement | SVGSVGElement | string,
    value: string,
    options?: Record<string, unknown>,
  ): void;
  export = JsBarcode;
}

declare module "qrcode" {
  function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: Record<string, unknown>,
  ): Promise<void>;
  function toDataURL(
    text: string,
    options?: Record<string, unknown>,
  ): Promise<string>;
  export { toCanvas, toDataURL };
}
