"use client";

import { useSyncExternalStore } from "react";
import { URGENT_MIN, timeLeft } from "@/lib/share";

// shortcut: 마감 = 페이지를 연 시각 + closesInMin. 새로고침하면 다시 처음부터 센다. 실제 데이터가 생기면 마감 시각으로 바꾼다.
export const SESSION_START = Math.floor(Date.now() / 1000);

// 분 단위 문구라 30초마다만 다시 그린다
const subscribe = (tick: () => void) => {
  const id = setInterval(tick, 30_000);
  return () => clearInterval(id);
};
const nowSec = () => Math.floor(Date.now() / 1000);

export default function Countdown({ closesInMin }: { closesInMin: number }) {
  // 서버 렌더에서는 null → 경과 0초로 그려서 hydration 불일치를 피한다
  const now = useSyncExternalStore(subscribe, nowSec, () => null);
  const left = closesInMin * 60 - (now === null ? 0 : now - SESSION_START);
  const urgent = left > 0 && left <= URGENT_MIN * 60;
  return (
    <span className={urgent ? "font-semibold text-coral-deep" : undefined}>{timeLeft(left)}</span>
  );
}
