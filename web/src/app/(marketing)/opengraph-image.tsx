import { ImageResponse } from "next/og";

export const alt = "Academy Ops — QR attendance for sports academies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #f8faf9 0%, #e6f4f1 45%, #0f766e 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "#0f766e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#111111" }}>Academy Ops</span>
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#111111",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            maxWidth: 900,
          }}
        >
          Scan at the gate. Collect fees. Send receipts.
        </div>
        <p
          style={{
            marginTop: 24,
            fontSize: 26,
            color: "#3f3f46",
            maxWidth: 780,
            lineHeight: 1.4,
          }}
        >
          QR attendance, fee collection, and WhatsApp receipts for Indian sports academies.
        </p>
      </div>
    ),
    { ...size },
  );
}
