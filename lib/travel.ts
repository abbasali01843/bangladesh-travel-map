/** Shared travel progress helpers for Ghurechi */

export const TOTAL_DISTRICTS = 64;

export type TravelLevel = {
  title: string;
  badge: string;
  min: number;
};

export const LEVELS: TravelLevel[] = [
  { title: "নতুন পথিক", badge: "🌱 যাত্রা শুরু", min: 0 },
  { title: "ঘোরাঘুরি শুরু", badge: "✈️ অভিজ্ঞ ভ্রমণকারী", min: 8 },
  { title: "অভিজ্ঞ ভ্রমণকারী", badge: "🧭 ভ্রমণপাগল", min: 20 },
  { title: "বাংলাদেশ ভ্রমণপাগল", badge: "🔥 দেশভ্রমণ কিংবদন্তি", min: 40 },
  { title: "দেশভ্রমণ কিংবদন্তি", badge: "🏆 বাংলাদেশজয়ী", min: 64 },
];

export function getPercent(count: number): number {
  return Math.round((count / TOTAL_DISTRICTS) * 100);
}

export function getLevel(count: number): TravelLevel {
  if (count >= 64) return LEVELS[4];
  if (count >= 40) return LEVELS[3];
  if (count >= 20) return LEVELS[2];
  if (count >= 8) return LEVELS[1];
  return LEVELS[0];
}

export function getNextMilestone(count: number): number {
  if (count < 8) return 8;
  if (count < 20) return 20;
  if (count < 40) return 40;
  return 64;
}

export function getMotivationalText(count: number): string {
  if (count === 64) return "সব ৬৪ জেলা! বাংলাদেশজয়ী।";
  if (count >= 40) return "আর একটু—৬৪ জেলার কাছাকাছি!";
  if (count >= 20) return "ভ্রমণ এখন জমে গেছে!";
  if (count >= 8) return "ভালো শুরু! আরও জেলা ঘুরুন।";
  return "আরও জেলা ঘুরে স্কোর বাড়ান।";
}
