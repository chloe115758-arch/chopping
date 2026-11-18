"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 코랄 면 위 글자·아이콘은 brown만 쓴다 (대비 5.59. 흰색은 2.40으로 미달)
const icon = "size-6 fill-none stroke-current stroke-2";

export default function BottomNav() {
  const pathname = usePathname();
  // 상세 화면은 하단 고정 신청 버튼이 자리를 쓴다
  if (pathname.startsWith("/posts/")) return null;

  const side = (href: string, label: string, path: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex flex-col items-center gap-1 pb-3 pt-4 text-nav ${
          active ? "font-bold underline decoration-2 underline-offset-4" : "font-medium"
        }`}
      >
        <svg viewBox="0 0 24 24" aria-hidden className={icon}>
          <path d={path} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {label}
      </Link>
    );
  };

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 mx-auto grid w-full max-w-[430px] grid-cols-3 rounded-t-nav bg-coral text-brown"
    >
      {side("/", "동네 피드", "M4 11l8-7 8 7v9h-5v-6H9v6H4z")}
      {/* 가운데 올리기 버튼은 위로 솟은 원 */}
      <Link
        href="/new"
        aria-current={pathname === "/new" ? "page" : undefined}
        className={`relative flex flex-col items-center justify-end pb-3 text-nav ${
          pathname === "/new"
            ? "font-bold underline decoration-2 underline-offset-4"
            : "font-medium"
        }`}
      >
        <span className="absolute -top-6 flex size-16 items-center justify-center rounded-full border-4 border-coral bg-card">
          <svg viewBox="0 0 24 24" aria-hidden className={`${icon} size-7`}>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </span>
        나눔 올리기
      </Link>
      {side("/my", "내 활동", "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6")}
    </nav>
  );
}
