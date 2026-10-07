import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import LogoutButton from "./logout-button";
import ModerationQueue from "./moderation-queue";
import VerificationPanel from "./verification-panel";

async function getAdminContext() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: role } = await supabase.from("UserRole").select("role").eq("authUserId", user.id).maybeSingle();
  if (!role || role.role !== "ADMIN") redirect("/");
  return { supabase, user };
}

function Card({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-black text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-black">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{note}</div>
    </div>
  );
}

export default async function AdminPage() {
  const { supabase, user } = await getAdminContext();

  const [{ data: claimRows }, { data: reportRows }] = await Promise.all([
    supabase.from("Claim").select("id, serviceId, status, createdAt").eq("status", "PENDING").order("createdAt", { ascending: false }).limit(20),
    supabase.from("Report").select("id, serviceId, status, reason, createdAt").order("createdAt", { ascending: false }).limit(20),
  ]);

  const [{ count: pendingClaims }, { count: pendingReports }, { count: sources }, { count: verifications }, { count: qualitySnapshots }] = await Promise.all([
    supabase.from("Claim").select("*", { count: "exact", head: true }).eq("status", "PENDING"),
    supabase.from("Report").select("*", { count: "exact", head: true }),
    supabase.from("DataSource").select("*", { count: "exact", head: true }),
    supabase.from("VerificationRecord").select("*", { count: "exact", head: true }),
    supabase.from("DataQualitySnapshot").select("*", { count: "exact", head: true }),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <div className="text-xs font-black text-emerald-600">GHURECHI ADMIN</div>
            <h1 className="text-2xl font-black">Moderation Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-xs font-bold text-slate-500 sm:block">{user.email}</div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Card label="Pending Claims" value={pendingClaims ?? 0} note="Ownership requests" />
          <Card label="Reports" value={pendingReports ?? 0} note="User reports" />
          <Card label="Sources" value={sources ?? 0} note="Evidence registry" />
          <Card label="Verifications" value={verifications ?? 0} note="Verification records" />
          <Card label="Quality Checks" value={qualitySnapshots ?? 0} note="Data quality history" />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div className="text-xs font-black uppercase tracking-wider text-emerald-600">Workflow</div>
            <h2 className="mt-1 text-xl font-black">Moderation pipeline</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {[
                ["01", "Submission", "New local data enters the review queue."],
                ["02", "Evidence", "Source and freshness are checked."],
                ["03", "Decision", "Approve, reject or request changes."],
                ["04", "Audit", "Decision and verification history are stored."],
              ].map(([step, title, text]) => (
                <div key={step} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-black text-slate-400">{step}</div>
                  <div className="mt-2 font-black">{title}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">{text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="text-xs font-black uppercase tracking-wider text-emerald-700">System status</div>
            <h2 className="mt-1 text-xl font-black text-emerald-950">Admin access active</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-emerald-900">
              <li>✓ Authenticated admin session</li>
              <li>✓ ADMIN role mapping</li>
              <li>✓ RLS authorization</li>
              <li>✓ Verification audit tables</li>
              <li>✓ Data quality history</li>
            </ul>
          </div>
        </div>

        <ModerationQueue
          initialItems={[
            ...(claimRows ?? []).map((x) => ({ ...x, type: "CLAIM" as const, reason: null })),
            ...(reportRows ?? []).map((x) => ({ ...x, type: "REPORT" as const })),
          ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20)}
        />

        <VerificationPanel />

        <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
          <b>Workflow:</b> queue decision, evidence, verification level এবং audit history এখন Admin workflow-এর অংশ।
        </div>
      </section>
    </main>
  );
}
