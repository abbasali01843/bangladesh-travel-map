import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#059669",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ghurechi.vercel.app"),
  title: "বাংলাদেশ লোকাল ডিরেক্টরি — কাঞ্চনা ইউনিয়ন",
  description: "কাঞ্চনা ইউনিয়নের গ্রাম, ওয়ার্ড, যাতায়াত, শিক্ষা, বাজার ও জরুরি সেবার পাইলট ডিরেক্টরি।",
  applicationName: "বাংলাদেশ লোকাল ডিরেক্টরি",
  manifest: "/manifest.webmanifest",
  keywords: ["বাংলাদেশ লোকাল ডিরেক্টরি", "কাঞ্চনা", "সাতকানিয়া", "চট্টগ্রাম", "গ্রাম", "ইউনিয়ন"],
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="bn"><body>{children}</body></html>;
}
