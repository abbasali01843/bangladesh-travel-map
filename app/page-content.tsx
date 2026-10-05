"use client";

import { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { districts } from "../data/districts";
import { getPercent } from "../lib/travel";
import { Header } from "./components/Header";
import { ScoreHero } from "./components/ScoreHero";
import { MapSection } from "./components/MapSection";
import { DistrictPicker } from "./components/DistrictPicker";
import { Sidebar } from "./components/Sidebar";
import { ShareModal } from "./components/ShareModal";
import { Leaderboard } from "./leaderboard";

export default function Home() {
  const [visited, setVisited] = useState<string[]>([]);
  const [mapOpen, setMapOpen] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [challengeVisited, setChallengeVisited] = useState<string[]>([]);
  const [challengeCopied, setChallengeCopied] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const challenge = params.get("challenge");
      if (challenge) {
        setChallengeVisited(
          challenge.split(",").filter((id) => districts.some((d) => d.id === id))
        );
      }
      const raw = params.get("v");
      if (raw && !challenge) {
        const ids = raw
          .split(",")
          .filter((id) => districts.some((d) => d.id === id));
        setVisited(ids);
        return;
      }
      const saved = localStorage.getItem("ghurechi-visited");
      if (saved) setVisited(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ghurechi-visited", JSON.stringify(visited));
      const url = new URL(location.href);
      if (visited.length) {
        url.searchParams.set("v", visited.join(","));
      } else {
        url.searchParams.delete("v");
      }
      history.replaceState({}, "", url.toString());
    } catch {}
  }, [visited]);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const toggle = (id: string) =>
    setVisited((v) =>
      v.includes(id) ? v.filter((x) => x !== id) : [...v, id]
    );

  const selectAll = () => setVisited(districts.map((d) => d.id));
  const clearAll = () => setVisited([]);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://ghurechi.vercel.app/";

  const challengeUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?challenge=${encodeURIComponent(visited.join(","))}`
      : "https://ghurechi.vercel.app/";

  const percent = getPercent(visited.length);
  const shareText = `আমি বাংলাদেশের ${visited.length}টি জেলা ঘুরেছি — ${percent}%! তুমি কয়টি ঘুরেছ? 🇧🇩`;

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  };

  const exportShareCard = async () => {
    const node = document.getElementById("ghurechi-share-card");
    if (!node) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "ghurechi-travel-score.png", {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Ghurechi — আমার Travel Score",
          text: shareText,
          url: shareUrl,
          files: [file],
        });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "ghurechi-travel-score.png";
        a.click();
      }
    } catch {
    } finally {
      setDownloading(false);
    }
  };

  const copyChallenge = async () => {
    try {
      await navigator.clipboard.writeText(challengeUrl);
      setChallengeCopied(true);
      setTimeout(() => setChallengeCopied(false), 1800);
    } catch {}
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Header
        visitedCount={visited.length}
        installPrompt={installPrompt}
        onInstall={installApp}
      />

      <ScoreHero visitedCount={visited.length} />

      <MapSection
        visited={visited}
        mapOpen={mapOpen}
        onToggleMap={() => setMapOpen((v) => !v)}
        onToggleDistrict={toggle}
      />

      <section className="mx-auto max-w-7xl px-4 pb-5 sm:px-5">
        <Leaderboard visited={visited} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 sm:px-5 lg:grid-cols-[1fr_300px]">
        <DistrictPicker
          visited={visited}
          onToggle={toggle}
          onSelectAll={selectAll}
          onClearAll={clearAll}
        />
        <Sidebar
          visited={visited}
          challengeVisited={challengeVisited}
          challengeCopied={challengeCopied}
          onCopyChallenge={copyChallenge}
          onOpenShare={() => setShareOpen(true)}
        />
      </section>

      {shareOpen && (
        <ShareModal
          visited={visited}
          downloading={downloading}
          copied={copied}
          onClose={() => setShareOpen(false)}
          onExport={exportShareCard}
          onCopyLink={copyShareLink}
          onReset={() => {
            setVisited([]);
            setShareOpen(false);
          }}
        />
      )}

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        Ghurechi · বাংলাদেশের ট্রাভেল ম্যাপ
      </footer>
    </main>
  );
}
