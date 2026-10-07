"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase-browser";

type Item = {
  id: string;
  serviceId: string | null;
  type: "CLAIM" | "REPORT";
  status: string;
  reason?: string | null;
  createdAt: string;
};

export default function ModerationQueue({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function decide(item: Item, nextStatus: "APPROVED" | "REJECTED") {
    setBusy(item.id);
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    const table = item.type === "CLAIM" ? "Claim" : "Report";
    const { error } = await supabase
      .from(table)
      .update(item.type === "CLAIM"
        ? { status: nextStatus, reviewedAt: new Date().toISOString() }
        : { status: nextStatus })
      .eq("id", item.id);

    if (error) {
      setMessage("পরিবর্তন করা যায়নি। RLS বা database permission পরীক্ষা করুন।");
    } else {
      setItems((current) => current.filter((x) => x.id !== item.id));
      setMessage(nextStatus === "APPROVED" ? "অনুমোদন সম্পন্ন হয়েছে।" : "Reject সম্পন্ন হয়েছে।");
    }
    setBusy(null);
  }

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-emerald-600">Live queue</div>
          <h2 className="mt-1 text-xl font-black">Pending moderation</h2>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{items.length}</div>
      </div>

      {message && <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{message}</div>}

      {items.length === 0 ? (
        <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">এখন কোনো pending item নেই।</div>
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-slate-400">{item.type}</div>
                  <div className="mt-1 font-bold">Entity: {item.serviceId ?? "—"}</div>
                  {item.reason && <div className="mt-1 text-sm text-slate-500">{item.reason}</div>}
                  <div className="mt-1 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString("bn-BD")}</div>
                </div>
                <div className="flex gap-2">
                  <button disabled={busy === item.id} onClick={() => decide(item, "REJECTED")} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-700 disabled:opacity-50">Reject</button>
                  <button disabled={busy === item.id} onClick={() => decide(item, "APPROVED")} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white disabled:opacity-50">Approve</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
