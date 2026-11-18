"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

// 가운데 제목 + 왼쪽 뒤로 가기
export default function PageHeader({ title, back }: { title: string; back?: string }) {
  const router = useRouter();
  return (
    <header className="relative flex h-12 items-center justify-center">
      {back && (
        <Link
          href={back}
          aria-label="뒤로 가기"
          // 앱 안에서 넘어왔으면 진짜 뒤로 가서 피드의 필터와 스크롤 위치를 살린다. 링크로 바로 들어온 경우만 back 주소로 간다.
          // shortcut: 방문 기록 길이로만 판단해서, 다른 사이트를 보던 탭에 주소를 직접 쳐서 들어오면 그 사이트로 돌아간다. 필요해지면 앱 내 이동 여부를 따로 기록한다.
          onClick={(e) => {
            if (window.history.length > 1) {
              e.preventDefault();
              router.back();
            }
          }}
          className="absolute left-0 flex size-12 items-center text-2xl"
        >
          ←
        </Link>
      )}
      <h1 className="text-heading font-semibold">{title}</h1>
    </header>
  );
}
