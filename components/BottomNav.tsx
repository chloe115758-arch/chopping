"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "동네 피드" },
  { href: "/new", label: "나눔 올리기" },
  { href: "/my", label: "내 활동" },
];

export default function BottomNav() {
  const pathname = usePathname();
  // 상세 화면은 하단 고정 신청 버튼이 자리를 쓴다
  if (pathname.startsWith("/posts/")) return null;
  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] border-t border-line bg-card"
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex-1 border-t-2 py-4 text-center text-sm ${
              active
                ? "border-coral font-bold text-brown"
                : "border-transparent text-brown-soft"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
