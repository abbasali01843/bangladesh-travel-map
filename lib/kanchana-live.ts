import { createClient } from "@supabase/supabase-js";
import seedData from "../data/kanchana.json";

type SeedData = typeof seedData;

type LiveService = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  subcategory: string | null;
  phone: string | null;
  description: string | null;
  verificationLevel: string;
  areaId: string | null;
  areaName?: string | null;
};

function verified(level: string) {
  return ["OFFICIAL", "VERIFIED", "COMMUNITY"].includes(level);
}

export async function getKanchanaLiveData(): Promise<SeedData> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return seedData;

  const supabase = createClient(url, key);

  const [{ data: services }, { data: areas }] = await Promise.all([
    supabase
      .from("Service")
      .select("id,name,slug,categoryId,subcategory,phone,description,verificationLevel,areaId")
      .eq("unionId", "un_15_74_741")
      .eq("status", "APPROVED")
      .in("verificationLevel", ["OFFICIAL", "VERIFIED", "COMMUNITY"]),
    supabase
      .from("Area")
      .select("id,name,slug,type,parentAreaId,verificationLevel")
      .eq("unionId", "un_15_74_741")
      .neq("verificationLevel", "ARCHIVED"),
  ]);

  if (!services || !areas) return seedData;

  const areaById = new Map(areas.map((a) => [a.id, a]));
  const live = services as LiveService[];

  const villages = areas
    .filter((a) => a.type === "VILLAGE")
    .map((a) => {
      const wards = areas
        .filter((w) => w.type === "WARD" && w.parentAreaId === a.id)
        .map((w) => Number((w.name.match(/\d+/)?.[0] ?? "0")))
        .filter(Boolean)
        .sort((a, b) => a - b);
      return { id: a.slug, name: a.name, wards };
    })
    .filter((v) => v.wards.length > 0);

  const education = live
    .filter((s) => s.categoryId === "education")
    .map((s) => {
      const eiin = s.description?.match(/EIIN[:\s]+(\d+)/i)?.[1];
      return { name: s.name, verified: verified(s.verificationLevel), ...(eiin ? { eiin } : {}) };
    });

  const markets = live
    .filter((s) => s.categoryId === "business" && s.subcategory === "hat")
    .map((s) => ({
      name: s.name,
      type: "হাট-বাজার",
      area: s.areaId ? (areaById.get(s.areaId)?.name ?? "কাঞ্চনা") : "কাঞ্চনা",
      verified: verified(s.verificationLevel),
      ...(s.description ? { note: s.description } : {}),
    }));

  const transport = live
    .filter((s) => s.categoryId === "transport")
    .map((s) => ({
      name: s.name,
      verified: verified(s.verificationLevel),
      ...(s.description ? { note: s.description } : {}),
    }));

  const roads = transport.filter((x) => x.name.includes("সড়ক"));
  const bridges = transport.filter((x) => !x.name.includes("সড়ক"));

  const religious = live
    .filter((s) => s.categoryId === "religious")
    .map((s) => ({
      name: s.name,
      type: s.subcategory === "মসজিদ" ? "মসজিদ" : (s.subcategory ?? "ধর্মীয় স্থান"),
      verified: verified(s.verificationLevel),
    }));

  const emergencies = live
    .filter((s) => s.categoryId === "emergency" && s.phone)
    .map((s) => ({
      name: s.name,
      number: s.phone as string,
      type: s.subcategory ?? "জরুরি সেবা",
      verified: verified(s.verificationLevel),
    }));

  const searchIndex = [
    ...villages.map((v) => ({ name: v.name, type: "গ্রাম", verified: true, slug: v.id })),
    ...live.map((s) => ({
      name: s.name,
      type: s.categoryId === "education"
        ? (s.subcategory === "madrasa" ? "মাদ্রাসা" : "মাধ্যমিক")
        : s.categoryId === "business" && s.subcategory === "hat"
          ? "বাজার"
          : s.categoryId === "emergency"
            ? "জরুরি"
            : s.categoryId === "transport"
              ? "যাতায়াত"
              : s.categoryId === "religious"
                ? "স্থান"
                : "সেবা",
      verified: verified(s.verificationLevel),
      slug: s.slug,
    })),
  ];

  const next = {
    ...seedData,
    villages: villages.length ? villages : seedData.villages,
    wards: villages.flatMap((v) => v.wards.map((ward) => ({ ward, area: v.name }))),
    markets,
    transport: {
      ...seedData.transport,
      main_roads: roads,
      bridge_waterways: bridges,
    },
    education: {
      ...seedData.education,
      secondary: education.filter((x) => x.eiin !== "105039" && x.eiin !== "105047" && x.eiin !== "105055" && !x.name.includes("মাদ্রাসা") && !x.name.includes("দাখিল")),
      madrasas: education.filter((x) => x.eiin === "105039" || x.eiin === "105047" || x.eiin === "105055" || x.name.includes("মাদ্রাসা") || x.name.includes("দাখিল")),
      primary: [],
      primary_verification: "Supabase-এ বর্তমানে প্রকাশযোগ্য (APPROVED + VERIFIED/OFFICIAL/COMMUNITY) প্রাথমিক বিদ্যালয়ের রেকর্ড নেই; নতুন যাচাইকৃত রেকর্ড Admin Verification Center থেকে প্রকাশ করা যাবে.",
    },
    categories: {
      ...seedData.categories,
      religious_places: religious,
      landmarks: [],
      health: live.filter((s) => s.categoryId === "health").map((s) => ({ name: s.name, type: s.subcategory ?? "স্বাস্থ্যসেবা", verified: verified(s.verificationLevel) })),
    },
    emergency_numbers: emergencies,
    search_index: searchIndex,
    verification_note: "এই পেজের প্রকাশযোগ্য service data এখন Supabase থেকে আসে। শুধু APPROVED এবং OFFICIAL/VERIFIED/COMMUNITY রেকর্ড public view-তে দেখানো হয়।",
  };

  return next as unknown as SeedData;
}
