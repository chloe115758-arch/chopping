"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

export type Pin = { lat: number; lng: number };

const MANGWON_STATION: [number, number] = [37.556, 126.9101];

// 지도를 눌러 수령 장소에 핀을 찍는다. 키가 필요 없는 OpenStreetMap 타일을 쓴다.
// shortcut: 장소 이름 검색·주소 변환은 없다. 실제 서비스에서는 카카오/네이버 지도 API로 바꾼다.
export default function MapPicker({ onPick }: { onPick: (pin: Pin) => void }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    // leaflet은 window가 필요해서 브라우저에서만 불러온다
    import("leaflet").then(({ default: L }) => {
      if (cancelled || !box.current) return;
      const map = L.map(box.current).setView(MANGWON_STATION, 16);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);
      let marker: ReturnType<typeof L.circleMarker> | undefined;
      map.on("click", (e) => {
        marker?.remove();
        // 기본 마커 이미지는 번들러 경로 문제가 있어 원형 핀을 쓴다
        marker = L.circleMarker(e.latlng, {
          radius: 10,
          weight: 3,
          color: "#3d2b1f",
          fillColor: "#f28c6b",
          fillOpacity: 1,
        }).addTo(map);
        onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
      cleanup = () => map.remove();
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [onPick]);

  return (
    <div
      ref={box}
      role="application"
      aria-label="수령 장소 지도. 눌러서 핀을 찍어요"
      className="relative z-0 mt-2 h-60 w-full overflow-hidden rounded-field border border-line"
    />
  );
}
