"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CURRENT_USER } from "@/lib/mock-data";
import { URGENT_MIN, filterPosts } from "@/lib/share";
import { useStore } from "@/lib/store";
import EmptyState from "./EmptyState";
import PostCard from "./PostCard";
import Tabs from "./Tabs";

// /?empty=1 로 빈 피드 화면을 시연할 수 있다
export default function Feed() {
  const empty = useSearchParams().has("empty");
  const { posts } = useStore();
  const [tab, setTab] = useState(0);
  const dong = CURRENT_USER.town;
  const all = empty ? [] : filterPosts(posts, { dong });
  const shown = filterPosts(all, { dong, urgent: tab === 1 });

  return (
    <main className="flex flex-col gap-7">
      <header>
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG 로고라 최적화 불필요 */}
        <img
          src="/logo.svg"
          alt="chopping"
          width={1201}
          height={397}
          className="-ml-1 h-12 w-auto"
        />
        <p className="mt-1 text-meta text-brown-soft">대용량을 이웃과 쪼개서 사요</p>
        <h1 className="mt-5 text-xl font-semibold leading-snug">
          {CURRENT_USER.nickname}님, 안녕하세요.
        </h1>
      </header>

      {all.length === 0 ? (
        <EmptyState
          message="아직 조용한 동네예요. 첫 나눔을 올려볼까요?"
          action={{ href: "/new", label: "나눔 올리기" }}
        />
      ) : (
        <section className="flex flex-col gap-3">
          <h2 className="text-heading font-semibold">
            {CURRENT_USER.town} 나눔 {all.length}개
          </h2>
          <Tabs labels={["전체", `마감 임박 · ${URGENT_MIN / 60}시간 이내`]} value={tab} onChange={setTab} />
          {shown.length === 0 ? (
            <EmptyState message="지금은 마감 임박한 나눔이 없어요." />
          ) : (
            <ul className="flex flex-col gap-3">
              {shown.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
