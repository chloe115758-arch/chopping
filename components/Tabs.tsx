// 알약 트랙 안에서 하나를 고르는 탭. 선택된 항목은 brown 면 + cream 글자 (대비 12.75)
export default function Tabs({
  labels,
  value,
  onChange,
}: {
  labels: string[];
  value: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex rounded-full bg-line p-1">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          aria-pressed={i === value}
          onClick={() => onChange(i)}
          className={`min-h-11 flex-1 rounded-full text-meta ${
            i === value ? "bg-brown font-semibold text-cream" : "font-medium text-brown"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
