import { createClient } from "@supabase/supabase-js";

const PUBLIC_LEVELS = ["OFFICIAL", "VERIFIED", "COMMUNITY"] as const;

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function getDistrictBySlug(slug: string) {
  const supabase = client();
  if (!supabase) return null;
  const { data } = await supabase
    .from("District")
    .select("id,name,slug")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getUpazilaBySlug(slug: string) {
  const supabase = client();
  if (!supabase) return null;
  const { data } = await supabase
    .from("Upazila")
    .select("id,name,slug,districtId")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getUnionBySlug(slug: string) {
  const supabase = client();
  if (!supabase) return null;
  const { data } = await supabase
    .from("Union")
    .select("id,name,slug,upazilaId")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getDistrictDirectory(slug: string) {
  const supabase = client();
  if (!supabase) return null;
  const district = await getDistrictBySlug(slug);
  if (!district) return null;

  const [{ data: upazilas }, { count: serviceCount }] = await Promise.all([
    supabase.from("Upazila").select("id,name,slug").eq("districtId", district.id).order("name"),
    supabase.from("Service", { count: "exact", head: true })
      .eq("districtId", district.id).eq("status", "APPROVED").in("verificationLevel", [...PUBLIC_LEVELS]),
  ]);

  return { district, upazilas: upazilas ?? [], serviceCount: serviceCount ?? 0 };
}

export async function getUpazilaDirectory(slug: string) {
  const supabase = client();
  if (!supabase) return null;
  const upazila = await getUpazilaBySlug(slug);
  if (!upazila) return null;

  const [{ data: district }, { data: unions }, { count: serviceCount }] = await Promise.all([
    supabase.from("District").select("id,name,slug").eq("id", upazila.districtId).maybeSingle(),
    supabase.from("Union").select("id,name,slug").eq("upazilaId", upazila.id).order("name"),
    supabase.from("Service", { count: "exact", head: true })
      .eq("upazilaId", upazila.id).eq("status", "APPROVED").in("verificationLevel", [...PUBLIC_LEVELS]),
  ]);

  return { upazila, district, unions: unions ?? [], serviceCount: serviceCount ?? 0 };
}

export async function getUnionDirectory(slug: string) {
  const supabase = client();
  if (!supabase) return null;
  const union = await getUnionBySlug(slug);
  if (!union) return null;

  const [{ data: upazila }, { data: areas }, { count: serviceCount }] = await Promise.all([
    supabase.from("Upazila").select("id,name,slug,districtId").eq("id", union.upazilaId).maybeSingle(),
    supabase.from("Area").select("id,name,slug,type,parentAreaId,verificationLevel").eq("unionId", union.id).neq("verificationLevel", "ARCHIVED").order("type").order("name"),
    supabase.from("Service", { count: "exact", head: true })
      .eq("unionId", union.id).eq("status", "APPROVED").in("verificationLevel", [...PUBLIC_LEVELS]),
  ]);

  return { union, upazila, areas: areas ?? [], serviceCount: serviceCount ?? 0 };
}
