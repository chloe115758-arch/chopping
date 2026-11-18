"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { URGENT_MIN } from "@/lib/share";
import EmptyState from "./EmptyState";
import PostCard from "./PostCard";

export default function Feed({ empty }: { empty: boolean }) {
  const { posts } = useStore();
  const [urgentOnly, setUrgentOnly] = useState(false);
  const all = empty ? [] : posts;
  const shown = urgentOnly ? all.filter((p) => p.closesInMin <= URGENT_MIN) : all;

  const chip = (label: string, on: boolean) => (
    <button
      type="button"
      aria-pressed={urgentOnly === on}
      onClick={() => setUrgentOnly(on)}
      className={`rounded-control border px-4 py-2 text-sm font-semibold ${
        urgentOnly === on
          ? "border-brown bg-brown text-cream"
          : "border-line bg-card text-brown"
      }`}
    >
      {label}
    </button>
  );

  return (
    <main>
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold">chopping</h1>
        <p className="text-sm text-brown-soft">망원동 · 조금씩 나눠 사요</p>
      </header>

      {all.length === 0 ? (
        <EmptyState
          message="아직 조용한 동네예요. 첫 나눔을 올려볼까요?"
          action={{ href: "/new", label: "나눔 올리기" }}
        />
      ) : (
        <>
          <div className="mb-4 flex gap-2">
            {chip("전체", false)}
            {chip("마감 임박", true)}
          </div>
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
        </>
      )}
    </main>
  );
}
