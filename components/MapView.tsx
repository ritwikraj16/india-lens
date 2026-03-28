"use client";

import { useEffect, useRef } from "react";
import { PhotoSpot } from "@/types/spot";

interface Props {
  spots: PhotoSpot[];
  selectedId?: string | null;
  onSpotClick: (id: string) => void;
}

const shotTypeColour: Record<string, string> = {
  landscape: "#38bdf8",
  architecture: "#a78bfa",
  wildlife: "#34d399",
  street: "#fb923c",
  astro: "#818cf8",
  portrait: "#f472b6",
  waterscape: "#60a5fa",
};

export default function MapView({ spots, selectedId, onSpotClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<Map<string, import("leaflet").Marker>>(new Map());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapRef.current) return; // already initialised

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const map = L.map(containerRef.current!, {
        center: [22.5, 80],
        zoom: 5,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // CartoDB Dark Matter — free, no API key
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map);

      spots.forEach((spot) => {
        const colour = shotTypeColour[spot.shotTypes[0]] ?? "#f59e0b";

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:28px;height:28px;
            background:${colour};
            border:3px solid #1c1917;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            box-shadow:0 2px 8px rgba(0,0,0,.5);
            cursor:pointer;
          "></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
        });

        const marker = L.marker([spot.lat, spot.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="min-width:180px;font-family:sans-serif">
              <strong style="font-size:13px">${spot.name}</strong><br/>
              <span style="font-size:11px;color:#999">${spot.region}</span>
            </div>`,
            { offset: [0, -20] }
          )
          .on("click", () => onSpotClick(spot.id));

        markersRef.current.set(spot.id, marker);
      });

      mapRef.current = map;
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pan to selected spot
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const marker = markersRef.current.get(selectedId);
    if (marker) {
      mapRef.current.flyTo(marker.getLatLng(), 10, { duration: 1 });
      marker.openPopup();
    }
  }, [selectedId]);

  // Update markers when filtered spots change
  useEffect(() => {
    if (!mapRef.current) return;
    const visibleIds = new Set(spots.map((s) => s.id));
    markersRef.current.forEach((marker, id) => {
      if (visibleIds.has(id)) {
        marker.addTo(mapRef.current!);
      } else {
        marker.remove();
      }
    });
  }, [spots]);

  return (
    <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden" />
  );
}
