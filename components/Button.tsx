import Link from "next/link";

// 알약 모양 기본 버튼. 터치 영역은 56px. 코랄 위 글자는 brown만 쓴다 (대비 5.59)
const base = "inline-flex min-h-14 items-center justify-center rounded-full px-6 text-base font-semibold";
const enabled = "bg-coral text-brown active:opacity-80";
const off = "cursor-not-allowed border border-line bg-cream text-brown-soft";

type Props =
  | { href: string; className?: string; children: React.ReactNode }
  | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>);

export default function Button(props: Props) {
  if (props.href !== undefined)
    return (
      <Link href={props.href} className={`${base} ${enabled} ${props.className ?? ""}`}>
        {props.children}
      </Link>
    );
  const { className = "", type = "button", ...rest } = props;
  return (
    <button
      type={type}
      className={`${base} ${rest.disabled ? off : enabled} ${className}`}
      {...rest}
    />
  );
}
