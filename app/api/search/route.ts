import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 300;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? "12") || 12, 1), 30);

  if (q.length < 2) {
    return NextResponse.json({ query: q, results: [] });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) {
    return NextResponse.json({ query: q, results: [] }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, publishableKey);

  const [services, areas] = await Promise.all([
    supabase
      .from("Service")
      .select("name,slug,categoryId,verificationLevel")
      .eq("status", "APPROVED")
      .in("verificationLevel", ["OFFICIAL", "VERIFIED", "COMMUNITY"])
      .textSearch("searchDocument", q, { type: "plain", config: "simple" })
      .limit(limit),
    supabase
      .from("Area")
      .select("name,slug,type,verificationLevel")
      .neq("verificationLevel", "ARCHIVED")
      .textSearch("searchDocument", q, { type: "plain", config: "simple" })
      .limit(limit),
  ]);

  if (services.error || areas.error) {
    return NextResponse.json({ query: q, results: [], error: "search_unavailable" }, { status: 503 });
  }

  const results = [
    ...(areas.data ?? []).map((item) => ({
      name: item.name,
      slug: item.slug,
      type: item.type === "VILLAGE" ? "গ্রাম" : item.type === "WARD" ? "ওয়ার্ড" : "এলাকা",
      verified: ["OFFICIAL", "VERIFIED", "COMMUNITY"].includes(item.verificationLevel),
      kind: "area" as const,
    })),
    ...(services.data ?? []).map((item) => ({
      name: item.name,
      slug: item.slug,
      type: item.categoryId === "education" ? "শিক্ষা" : item.categoryId === "health" ? "স্বাস্থ্য" : "সেবা",
      verified: true,
      kind: "service" as const,
    })),
  ].slice(0, limit);

  return NextResponse.json(
    { query: q, results },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
