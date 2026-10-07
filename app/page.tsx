import type { Metadata } from "next";
import HomeContent from "./page-content";
import { getKanchanaLiveData } from "../lib/kanchana-live";

export const metadata: Metadata = {
  title: "বাংলাদেশ লোকাল ডিরেক্টরি — কাঞ্চনা ইউনিয়ন",
  description: "কাঞ্চনা ইউনিয়নের গ্রাম, ওয়ার্ড, যাতায়াত, শিক্ষা, হাট-বাজার ও জরুরি সেবার পাইলট ডিরেক্টরি।",
};

export default async function Home() {
  const data = await getKanchanaLiveData();
  return <HomeContent data={data} />;
}
