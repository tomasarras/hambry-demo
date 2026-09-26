import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#dc2626",
          borderRadius: 8,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            fill="#fff"
            d="M4 8a8 8 0 0 1 16 0H4Zm-1 3h18v2H3v-2Zm1 4h16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
