import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Ghurechi — বাংলাদেশের কতটা ঘুরে দেখেছেন?", description: "বাংলাদেশের ৬৪ জেলা কতটা ঘুরে দেখেছেন তা ট্র্যাক করুন, স্কোর বানান এবং বন্ধুদের সাথে শেয়ার করুন।", manifest: "/manifest.webmanifest" };

export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="bn"><body>{children}</body></html>; }