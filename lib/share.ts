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

export const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

export const distance = (m: number) =>
  m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`;

export const URGENT_MIN = 180;

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
