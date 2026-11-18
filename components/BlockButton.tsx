import Link from "next/link";

// 누르면 두께 띠가 4px → 2px로 줄고 2px 내려간다. 터치 영역은 최소 48px.
const base =
  "mb-1 inline-flex min-h-12 items-center justify-center rounded-block px-6 font-bold";
const enabled =
  "bg-coral text-brown shadow-[0_4px_0_var(--color-coral-deep)] transition-[translate,box-shadow] duration-75 active:translate-y-0.5 active:shadow-[0_2px_0_var(--color-coral-deep)] motion-reduce:transition-none";
const off = "cursor-not-allowed border border-line bg-cream text-brown-soft";

type Props =
  | { href: string; className?: string; children: React.ReactNode }
  | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>);

export default function BlockButton(props: Props) {
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
