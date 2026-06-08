import { ImageResponse } from "next/og"
import { portfolio } from "@/lib/portfolio"

// Static OG image generated at build time, themed like the IDE.
export const runtime = "nodejs"
export const alt = `${portfolio.identity.fullName} — Developer Portfolio`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  const { identity } = portfolio
  const role = identity.roles[0] ?? "Fullstack Developer"
  const fileName = `${identity.firstName.toLowerCase()}.portfolio`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1e1e1e",
          fontFamily: "monospace",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 56,
            backgroundColor: "#323233",
            paddingLeft: 24,
            gap: 12,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#ff5f56" }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#ffbd2e" }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#27c93f" }} />
          <div style={{ marginLeft: 24, color: "#858585", fontSize: 22 }}>{`${fileName} — Visual Studio Code`}</div>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flex: 1 }}>
          {/* Activity bar */}
          <div style={{ width: 64, backgroundColor: "#333333" }} />

          {/* Editor */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "64px 72px",
              justifyContent: "center",
            }}
          >
            <div style={{ color: "#6a9955", fontSize: 28, marginBottom: 24 }}>
              {"// " + role}
            </div>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#d4d4d4" }}>
              <span style={{ color: "#569cd6" }}>const&nbsp;</span>
              <span style={{ color: "#dcdcaa" }}>dev</span>
              <span style={{ color: "#d4d4d4" }}>&nbsp;=</span>
            </div>
            <div style={{ fontSize: 92, fontWeight: 800, color: "#4ec9b0", marginTop: 8 }}>
              {identity.fullName}
            </div>
            <div style={{ display: "flex", marginTop: 40, gap: 12 }}>
              {["React", "Next.js", "Node.js", "TypeScript"].map((t) => (
                <div
                  key={t}
                  style={{
                    fontSize: 26,
                    color: "#9cdcfe",
                    border: "2px solid #3c3c3c",
                    borderRadius: 8,
                    padding: "6px 18px",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 44,
            backgroundColor: "#007acc",
            paddingLeft: 24,
            color: "#ffffff",
            fontSize: 22,
          }}
        >
          {`\u2728 ${identity.fullName} · Developer Portfolio`}
        </div>
      </div>
    ),
    { ...size },
  )
}
