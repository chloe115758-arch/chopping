"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ME } from "@/lib/mock-data";
import { URGENT_MIN } from "@/lib/share";
import { useStore } from "@/lib/store";
import EmptyState from "./EmptyState";
import PostCard from "./PostCard";
import Tabs from "./Tabs";

const pill =
  "rounded-full border border-line bg-card px-4 py-2 text-meta font-medium";

// /?empty=1 로 빈 피드 화면을 시연할 수 있다
export default function Feed() {
  const empty = useSearchParams().has("empty");
  const { posts, applied } = useStore();
  const [tab, setTab] = useState(0);
  const all = empty ? [] : posts;
  const shown =
    tab === 1 ? all.filter((p) => p.closesInMin <= URGENT_MIN) : all;
  const mineCount = posts.filter((p) => p.author.nickname === ME).length;

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
        <h1 className="mt-5 text-xl font-semibold leading-snug">
          {ME}님, 안녕하세요.
          <br />
          망원동에서 조금씩 나눠 사요.
        </h1>
        <div className="mt-3 flex gap-2">
          <Link href="/my" className={pill}>
            신청 {applied.length}건
          </Link>
          <Link href="/my" className={pill}>
            등록 {mineCount}건
          </Link>
        </div>
      </header>

      {all.length === 0 ? (
        <EmptyState
          message="아직 조용한 동네예요. 첫 나눔을 올려볼까요?"
          action={{ href: "/new", label: "나눔 올리기" }}
        />
      ) : (
        <section className="flex flex-col gap-3">
          <h2 className="text-heading font-semibold">동네 나눔이에요.</h2>
          <Tabs labels={["전체", "마감 임박"]} value={tab} onChange={setTab} />
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
