"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase-browser";

const LEVELS = ["OFFICIAL", "VERIFIED", "COMMUNITY", "UNVERIFIED", "ARCHIVED"] as const;
type Level = typeof LEVELS[number];

export default function VerificationPanel() {
  const [query, setQuery] = useState("");
  const [service, setService] = useState<any>(null);
  const [level, setLevel] = useState<Level>("VERIFIED");
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function findService() {
    setMessage("");
    setService(null);
    const supabase = createSupabaseBrowserClient();
    const term = query.trim();
    if (!term) return;

    const { data, error } = await supabase
      .from("Service")
      .select("id,name,slug,status,verificationStatus,verificationLevel,address")
      .or(`id.eq.${term},slug.eq.${term}`)
      .maybeSingle();

    if (error || !data) {
      setMessage("Service পাওয়া যায়নি। ID বা slug দিয়ে চেষ্টা করুন।");
      return;
    }
    setService(data);
    setLevel((data.verificationLevel as Level) || "VERIFIED");
  }

  async function verifyService() {
    if (!service) return;
    setBusy(true);
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      setMessage("Admin session পাওয়া যায়নি। আবার লগইন করুন।");
      setBusy(false);
      return;
    }

    let sourceId: string | null = null;
    if (sourceTitle.trim()) {
      const { data: source, error: sourceError } = await supabase
        .from("DataSource")
        .insert({
          title: sourceTitle.trim(),
          url: sourceUrl.trim() || null,
          sourceType: "ADMIN_REVIEW",
          lastCheckedAt: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (sourceError) {
        setMessage("Source সংরক্ষণ করা যায়নি।");
        setBusy(false);
        return;
      }
      sourceId = source.id;
    }

    const verificationStatus =
      level === "OFFICIAL" || level === "VERIFIED" || level === "COMMUNITY"
        ? "VERIFIED"
        : "UNVERIFIED";

    const { error: serviceError } = await supabase
      .from("Service")
      .update({ verificationLevel: level, verificationStatus, updatedAt: new Date().toISOString() })
      .eq("id", service.id);

    if (serviceError) {
      setMessage("Service verification update করা যায়নি।");
      setBusy(false);
      return;
    }

    const { error: recordError } = await supabase.from("VerificationRecord").insert({
      entityType: "SERVICE",
      entityId: service.id,
      level,
      sourceId,
      authVerifierId: authData.user.id,
      verifiedAt: new Date().toISOString(),
      note: note.trim() || null,
    });

    if (recordError) {
      setMessage("Service update হয়েছে, কিন্তু verification history সংরক্ষণ করা যায়নি।");
      setBusy(false);
      return;
    }

    setService({ ...service, verificationLevel: level, verificationStatus });
    setMessage("Verification ও history সফলভাবে সংরক্ষিত হয়েছে।");
    setBusy(false);
  }

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
      <div className="text-xs font-black uppercase tracking-wider text-emerald-600">Verification center</div>
      <h2 className="mt-1 text-xl font-black">Service verification</h2>
      <p className="mt-1 text-sm text-slate-500">Service ID বা slug দিয়ে entity খুঁজে evidence, verification level এবং audit history সংরক্ষণ করুন।</p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Service ID / slug" className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
        <button onClick={findService} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white">Find</button>
      </div>

      {service && (
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="font-black">{service.name}</div>
          <div className="mt-1 text-xs text-slate-500">{service.slug} · {service.address || "ঠিকানা নেই"}</div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Verification level
              <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">
                {LEVELS.map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              Source title
              <input value={sourceTitle} onChange={(e) => setSourceTitle(e.target.value)} placeholder="যেমন: সরকারি ওয়েবসাইট" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
            </label>
            <label className="text-sm font-bold sm:col-span-2">
              Source URL
              <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
            </label>
            <label className="text-sm font-bold sm:col-span-2">
              Verification note
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="কি যাচাই করা হয়েছে..." className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
            </label>
          </div>

          <button disabled={busy} onClick={verifyService} className="mt-4 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50">
            {busy ? "Saving..." : "Save verification"}
          </button>
        </div>
      )}

      {message && <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{message}</div>}
    </div>
  );
}
