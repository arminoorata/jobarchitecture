import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Job Architecture Toolkit. The six layers most leveling conversations skip past.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Shared Open Graph image for every route. Dark background, eyebrow-style
 * wordmark in accent gold, tagline below in muted text. Rendered by Next.js's
 * edge ImageResponse pipeline. System fonts only — the Outfit webfont isn't
 * available at edge without a separate fetch, and system-ui renders cleanly
 * at this scale.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 88px",
          background:
            "linear-gradient(135deg, #090b0f 0%, #11151b 100%)",
          color: "#f1ece3",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        {/* Eyebrow wordmark + accent rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <span
            style={{
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: 9,
              textTransform: "uppercase",
              color: "#c4a44a",
            }}
          >
            JOB ARCHITECTURE TOOLKIT
          </span>
          <span
            style={{
              flexGrow: 1,
              height: 1,
              background: "#c4a44a",
              opacity: 0.7,
            }}
          />
        </div>

        {/* Tagline + supporting line */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "#b2aba0",
              maxWidth: 1000,
            }}
          >
            The six layers most leveling conversations skip past.
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              lineHeight: 1.4,
              color: "#7c756a",
              maxWidth: 920,
            }}
          >
            Free directional leveling tool and education for HRBPs, managers,
            and Total Rewards leaders.
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderTop: "1px solid rgba(196,164,74,0.25)",
            paddingTop: 28,
          }}
        >
          <span
            style={{
              fontSize: 20,
              color: "#b2aba0",
              fontWeight: 400,
            }}
          >
            Built by Armi Noorata
          </span>
          <span
            style={{
              fontSize: 18,
              color: "#7c756a",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            jobarchitecture.arminoorata.com
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
