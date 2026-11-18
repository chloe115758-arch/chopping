"use client";

import { useState } from "react";
import { CURRENT_USER } from "@/lib/mock-data";
import { perPerson, won } from "@/lib/share";
import { useStore } from "@/lib/store";
import EmptyState from "./EmptyState";
import PostCard from "./PostCard";
import Tabs from "./Tabs";

export default function MyActivity() {
  const { posts, applied } = useStore();
  const [tab, setTab] = useState(0);

  const mine = posts.filter((p) => p.author.nickname === CURRENT_USER.nickname);
  const appliedPosts = applied.flatMap((a) => {
    const post = posts.find((p) => p.id === a.postId);
    return post ? [{ post, slot: a.slot }] : [];
  });
  const next = [...appliedPosts].sort((a, b) => a.slot.inHours - b.slot.inHours)[0];
  const nextShare = next && perPerson(next.post.totalQty, next.post.totalPrice, next.post.people);

  const stat = (name: string, value: string) => (
    <div className="flex flex-col-reverse">
      <dt className="text-xs font-medium">{name}</dt>
      <dd className="text-lg font-semibold">{value}</dd>
    </div>
  );

  return (
    <main className="flex flex-col gap-5">
      {/* 코랄 면 위 글자는 brown만 쓴다 (대비 5.59) */}
      <div className="-mx-gutter -mt-6 rounded-b-nav bg-coral px-gutter pb-6 pt-6">
        <h1 className="text-heading font-semibold">{CURRENT_USER.nickname}님의 활동</h1>
        <section className="mt-3 rounded-card bg-card p-4">
          <h2 className="text-meta font-medium text-brown-soft">다음 수령 일정</h2>
          {next ? (
            <>
              <p className="text-3xl font-bold leading-tight">{next.slot.label}</p>
              <p className="mt-1 text-heading font-semibold">{next.post.place}</p>
              <p className="mt-1 text-meta text-brown-soft">
                {next.post.item}
                {nextShare && ` · ${won(nextShare.price)}`}
              </p>
            </>
          ) : (
            <p className="mt-1 text-heading font-semibold">예정된 수령이 없어요.</p>
          )}
        </section>
        <dl className="mt-4 grid grid-cols-3 divide-x divide-brown/40 text-center">
          {stat("신청", `${appliedPosts.length}건`)}
          {stat("등록", `${mine.length}건`)}
          {stat("후기", `${CURRENT_USER.reviewCount}개`)}
        </dl>
      </div>

      <Tabs labels={["신청한 것", "등록한 것"]} value={tab} onChange={setTab} />

      {tab === 0 ? (
        appliedPosts.length === 0 ? (
          <EmptyState
            message="아직 신청한 나눔이 없어요."
            action={{ href: "/", label: "동네 피드 보기" }}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {appliedPosts.map(({ post, slot }) => (
              <li key={post.id}>
                <PostCard post={post} status={`${slot.label} 수령`} />
              </li>
            ))}
          </ul>
        )
      ) : mine.length === 0 ? (
        <EmptyState
          message="아직 올린 나눔이 없어요."
          action={{ href: "/new", label: "나눔 올리기" }}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {mine.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
