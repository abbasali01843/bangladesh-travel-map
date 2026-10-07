"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = { lat: number; lng: number; zoom: number; name: string };

export default function KanchanaMap({ lat, lng, zoom, name }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    let active = true;
    import("leaflet").then((L) => {
      if (!active || !mapRef.current || mapInstance.current) return;
      const map = L.map(mapRef.current, { scrollWheelZoom: false }).setView([lat, lng], zoom);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      markerRef.current = L.marker([lat, lng]).addTo(map).bindPopup("<b>" + name + "</b><br/>ইউনিয়ন-লেভেল ম্যাপ পয়েন্ট");
      mapInstance.current = map;
    });
    return () => {
      active = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerRef.current = null;
      }
    };
  }, [lat, lng, zoom, name]);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
      <div ref={mapRef} className="h-[360px] w-full sm:h-[430px]" aria-label={name + " map"} />
      <div className="border-t border-slate-200 bg-white px-4 py-3 text-[11px] font-semibold leading-5 text-slate-500">
        ম্যাপটি ইউনিয়ন-লেভেল অবস্থান দেখায়; এটি ওয়ার্ড/গ্রাম সীমানার সরকারি boundary নয়।
      </div>
    </div>
  );
}
