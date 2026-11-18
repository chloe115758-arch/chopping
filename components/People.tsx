// 사람 모양 블록: 둥근 머리 + 둥근 사각형 몸통. 채워진 자리는 코랄, 빈 자리는 점선.
// 코랄은 배경과 대비가 낮아서 인원 수는 반드시 옆 글자로도 적는다 (그래서 aria-hidden)
export default function People({
  joined,
  people,
  small,
  dropLast,
}: {
  joined: number;
  people: number;
  small?: boolean;
  dropLast?: boolean; // 마지막으로 채워진 자리(방금 신청한 내 자리)가 위에서 내려온다
}) {
  return (
    <span aria-hidden className={`inline-flex flex-wrap ${small ? "gap-0.5" : "gap-1.5"}`}>
      {Array.from({ length: people }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 28 40"
          className={`${small ? "h-[17px] w-3" : "h-10 w-7"} ${
            i < joined ? "fill-coral" : "fill-none stroke-brown-soft"
          } ${dropLast && i === joined - 1 ? "motion-safe:animate-drop" : ""}`}
          strokeWidth={small ? 3 : 1.5}
          strokeDasharray={i < joined ? undefined : "4 3"}
        >
          <circle cx="14" cy="8" r="6" />
          <rect x="3" y="17" width="22" height="21" rx="7" />
        </svg>
      ))}
    </span>
  );
}
