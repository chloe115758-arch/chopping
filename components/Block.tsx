// 조립 블록 카드: 윗면 돌기 2개 + 아래 4px 단색 두께 띠.
// 띠는 번짐 없는(blur 0) 그림자로 그린다. 강도: weak 피드 / mid 상세·등록 / strong 빈 화면·완료
const tones = {
  weak: { band: "shadow-[0_4px_0_var(--color-apricot)]", stud: "bg-apricot" },
  mid: { band: "shadow-[0_4px_0_var(--color-yellow)]", stud: "bg-yellow" },
  strong: { band: "shadow-[0_4px_0_var(--color-coral)]", stud: "bg-coral" },
};

export default function Block({
  tone = "weak",
  className = "",
  children,
}: {
  tone?: keyof typeof tones;
  className?: string;
  children: React.ReactNode;
}) {
  const t = tones[tone];
  return (
    // mt/mb: 돌기(6px)와 띠(4px)가 차지하는 자리
    <div
      className={`relative mb-1 mt-1.5 rounded-block border border-line bg-card ${t.band} ${className}`}
    >
      <span aria-hidden className={`absolute -top-1.5 left-5 h-1.5 w-6 rounded-t-sm ${t.stud}`} />
      <span aria-hidden className={`absolute -top-1.5 left-14 h-1.5 w-6 rounded-t-sm ${t.stud}`} />
      {children}
    </div>
  );
}
