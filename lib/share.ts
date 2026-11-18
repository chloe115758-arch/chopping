// 1인당 몫 계산. 가격은 1원 단위 올림(모자라지 않게), 수량은 소수 첫째 자리까지.
export function perPerson(totalQty: number, totalPrice: number, people: number) {
  if (!(totalQty > 0) || !(totalPrice > 0) || !Number.isInteger(people) || people < 2)
    return null;
  return {
    qty: Math.round((totalQty / people) * 10) / 10,
    price: Math.ceil(totalPrice / people),
  };
}

// 카드·상세에서 "내 몫" 수량을 보여주는 문구
export const shareQtyText = (
  post: { unit: string; splitByKind?: boolean },
  qty: number,
) => (post.splitByKind ? "종류별로 분할" : `내 몫 ${qty}${post.unit}`);

// 올린 사람의 나눔 이력. 처음이면 0 대신 "첫 나눔"
export const shareHistoryText = (count: number) =>
  count > 0 ? `나눔 ${count}번 완료` : "첫 나눔";

export const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

export const URGENT_MIN = 180;

// 피드 필터: 동네는 항상, 나머지(품목명 검색·카테고리·마감 임박)는 준 것만 함께 적용. 마감 빠른 순
export function filterPosts<
  P extends { item: string; dong: string; category: string; closesInMin: number },
>(posts: P[], f: { dong: string; q?: string; category?: string; urgent?: boolean }) {
  const q = f.q?.trim().toLowerCase();
  return posts
    .filter(
      (p) =>
        p.dong === f.dong &&
        (!q || p.item.toLowerCase().includes(q)) &&
        (!f.category || p.category === f.category) &&
        (!f.urgent || p.closesInMin <= URGENT_MIN),
    )
    .sort((a, b) => a.closesInMin - b.closesInMin);
}

// 남은 초 → "45분 남음" / "3시간 20분 남음" / "2일 남음". 분·일은 내림, 1분 미만은 1분
export function timeLeft(sec: number) {
  if (sec <= 0) return "마감";
  const min = Math.max(1, Math.floor(sec / 60));
  if (min < 60) return `${min}분 남음`;
  if (min < 1440) return `${Math.floor(min / 60)}시간${min % 60 ? ` ${min % 60}분` : ""} 남음`;
  return `${Math.floor(min / 1440)}일 남음`;
}

// 수령 시각 → "11월 19일(목) 오후 7시" / "오전 11시 30분"
export function slotLabel(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes();
  return `${d.getMonth() + 1}월 ${d.getDate()}일(${"일월화수목금토"[d.getDay()]}) ${
    h < 12 ? "오전" : "오후"
  } ${h % 12 || 12}시${m ? ` ${m}분` : ""}`;
}
