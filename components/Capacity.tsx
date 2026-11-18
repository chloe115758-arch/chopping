// 모집 현황: 총 인원만큼 사람 모양 블록을 그리고 모인 인원만 코랄로 칠한다.
// 코랄은 흰 배경과 3:1이 안 돼서 갈색 테두리를 두르고, 숫자를 항상 같이 적는다.
// 모양은 일반 픽토그램(둥근 머리 + 네모 몸통). 특정 장난감 피규어의 실루엣은 따라 하지 않는다.
export default function Capacity({ joined, people }: { joined: number; people: number }) {
  return (
    <span className="flex items-center gap-2">
      <span role="img" aria-label={`${people}명 중 ${joined}명 모집`} className="flex gap-0.5">
        {Array.from({ length: people }, (_, i) => (
          <svg
            key={i}
            viewBox="0 0 14 18"
            className={`h-[18px] w-3.5 stroke-brown-soft ${i < joined ? "fill-coral" : "fill-card"}`}
          >
            <circle cx="7" cy="4.5" r="3.5" />
            <rect x="1.5" y="9.5" width="11" height="8" rx="2" />
          </svg>
        ))}
      </span>
      <span aria-hidden>
        {joined}/{people}명
      </span>
    </span>
  );
}
