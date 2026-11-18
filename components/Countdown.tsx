"use client";

import { useSyncExternalStore } from "react";
import { URGENT_MIN, hms } from "@/lib/share";

// shortcut: 마감 = 페이지를 연 시각 + closesInMin. 새로고침하면 다시 처음부터 센다. 실제 데이터가 생기면 마감 시각으로 바꾼다.
export const SESSION_START = Math.floor(Date.now() / 1000);

const subscribe = (tick: () => void) => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
};
const nowSec = () => Math.floor(Date.now() / 1000);

export default function Countdown({ closesInMin }: { closesInMin: number }) {
  // 서버 렌더에서는 null → 경과 0초로 그려서 hydration 불일치를 피한다
  const now = useSyncExternalStore(subscribe, nowSec, () => null);
  const left = closesInMin * 60 - (now === null ? 0 : now - SESSION_START);
  if (left <= 0) return <span>마감</span>;
  // 마감 임박만 초 단위로 센다
  if (left <= URGENT_MIN * 60)
    return (
      <span className="font-semibold tabular-nums text-coral-deep">{hms(left)} 남음</span>
    );
  if (left < 86400) return <span>{Math.floor(left / 3600)}시간 남음</span>;
  // 날짜는 브라우저 시계·시간대가 필요해서 hydration이 끝난 뒤에만 그린다
  if (now === null) return <span />;
  const due = new Date((SESSION_START + closesInMin * 60) * 1000);
  return (
    <span>
      {due.getMonth() + 1}/{due.getDate()} 마감
    </span>
  );
}
