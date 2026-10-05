import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#059669",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ghurechi.vercel.app"
  ),
  title: "Ghurechi — বাংলাদেশের কতটা ঘুরে দেখেছেন?",
  description:
    "বাংলাদেশের ৬৪ জেলা কতটা ঘুরে দেখেছেন তা ট্র্যাক করুন, Travel Score বানান এবং বন্ধুদের Challenge দিন।",
  applicationName: "Ghurechi",
  manifest: "/manifest.webmanifest",
  keywords: [
    "Bangladesh travel",
    "64 districts",
    "travel map",
    "Ghurechi",
    "বাংলাদেশ ভ্রমণ",
    "জেলা ম্যাপ",
  ],
  authors: [{ name: "Abbas Ali" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Ghurechi — বাংলাদেশের কতটা ঘুরে দেখেছেন?",
    description:
      "বাংলাদেশের ৬৪ জেলা কতটা ঘুরে দেখেছেন তা ট্র্যাক করুন এবং বন্ধুদের Challenge দিন।",
    type: "website",
    locale: "bn_BD",
    siteName: "Ghurechi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghurechi — বাংলাদেশের কতটা ঘুরে দেখেছেন?",
    description:
      "বাংলাদেশের ৬৪ জেলা কতটা ঘুরে দেখেছেন তা ট্র্যাক করুন এবং বন্ধুদের Challenge দিন।",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
