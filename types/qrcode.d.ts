declare module "qrcode" {
  export interface QRCodeToDataURLOptions {
    width?: number;
    margin?: number;
    errorCorrectionLevel?: "low" | "medium" | "quartile" | "high";
    color?: { dark?: string; light?: string };
  }

  export function toDataURL(
    text: string,
    options?: QRCodeToDataURLOptions,
  ): Promise<string>;

  export function toString(
    text: string,
    options?: QRCodeToDataURLOptions & { type?: "svg" | "utf8" | "terminal" },
  ): Promise<string>;
}
