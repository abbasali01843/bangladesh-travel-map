import { ImageResponse } from "next/og";
import { districts } from "../../../data/districts";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

function level(count: number) {
  return count === 0 ? "নতুন পথিক" : count < 8 ? "ঘোরাঘুরি শুরু" : count < 20 ? "অভিজ্ঞ ভ্রমণকারী" : count < 40 ? "বাংলাদেশ ভ্রমণপাগল" : "দেশভ্রমণ কিংবদন্তি";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw = url.searchParams.get("v") ?? "";
  const visited = raw.split(",").filter((id) => districts.some((d) => d.id === id));
  const percent = Math.round((visited.length / 64) * 100);

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "58px 68px", background: "#020617", color: "white", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 40, fontWeight: 900 }}>Ghurechi<span style={{ color: "#34d399" }}>.</span></div>
          <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 4, color: "#94a3b8" }}>BANGLADESH TRAVEL MAP</div>
        </div>
        <div style={{ border: "1px solid #334155", borderRadius: 999, padding: "12px 20px", fontSize: 18, fontWeight: 800, color: "#cbd5e1" }}>{level(visited.length)}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 118, lineHeight: 1, fontWeight: 900, color: "#34d399" }}>{percent}%</div>
        <div style={{ marginTop: 12, fontSize: 34, fontWeight: 850 }}>{visited.length} / 64 জেলা ঘুরেছি</div>
        <div style={{ marginTop: 10, fontSize: 22, color: "#94a3b8" }}>বাংলাদেশের কতটা ঘুরে দেখেছেন?</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, color: "#64748b" }}>
        <span>Ghurechi</span>
        <span>তুমি কয়টি ঘুরেছ?</span>
      </div>
      <div style={{ position: "absolute", right: -100, top: -140, width: 420, height: 420, borderRadius: 999, background: "rgba(16,185,129,.16)" }} />
    </div>,
    size
  );
}
