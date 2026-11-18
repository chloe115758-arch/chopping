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

// 남은 초 → "시:분:초" (24시간을 넘으면 시가 계속 커진다: 48:00:00)
export function hms(sec: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(sec / 3600))}:${pad(Math.floor(sec / 60) % 60)}:${pad(sec % 60)}`;
}
