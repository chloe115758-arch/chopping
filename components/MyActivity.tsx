"use client";

import { useState } from "react";
import { CURRENT_USER } from "@/lib/mock-data";
import { POLICY } from "@/lib/policy-copy";
import { perPerson, won } from "@/lib/share";
import { useStore } from "@/lib/store";
import Button from "./Button";
import EmptyState from "./EmptyState";
import PostCard from "./PostCard";
import Sheet from "./Sheet";
import Tabs from "./Tabs";

const STEPS = ["신청", "확정", "수령"];
const secondary = "min-h-11 rounded-full border border-line bg-card px-4 text-meta font-semibold";

// 신청 → 확정 → 수령. 지금 단계는 brown 알약(cream 글자, 대비 12.75), 지난 단계는 체크, 남은 단계는 연하게
function Steps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1.5 text-meta">
      {STEPS.map((name, i) => (
        <li key={name} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden className="h-px w-4 bg-brown-soft" />}
          <span
            aria-current={i === current ? "step" : undefined}
            className={
              i === current
                ? "rounded-full bg-brown px-3 py-1 font-semibold text-cream"
                : i < current
                  ? "font-semibold"
                  : "text-brown-soft"
            }
          >
            {i < current && <span aria-hidden>✓ </span>}
            {name}
            {i < current && <span className="sr-only"> 완료</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function MyActivity() {
  const { posts, applied, cancel, nickname } = useStore();
  const [tab, setTab] = useState(0);
  const [cancelId, setCancelId] = useState<string>(); // 취소 확인 시트에 올린 글
  const [copied, setCopied] = useState<"ok" | "fail">();
  const cancelPost = posts.find((p) => p.id === cancelId);

  const copyPlace = async (place: string) => {
    try {
      await navigator.clipboard.writeText(place);
      setCopied("ok");
    } catch {
      setCopied("fail"); // 권한이 막힌 브라우저
    }
    setTimeout(() => setCopied(undefined), 2000);
  };

  const mine = posts.filter((p) => p.mine);
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
        <h1 className="text-heading font-semibold">{nickname}님의 활동</h1>
        <section className="mt-3 rounded-card bg-card p-4">
          <h2 className="text-meta font-medium text-brown-soft">다음 수령 일정</h2>
          {next ? (
            <>
              <p className="text-3xl font-bold leading-tight">{next.slot.label}</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-heading font-semibold">{next.post.place}</p>
                <button
                  type="button"
                  onClick={() => copyPlace(next.post.place)}
                  className={`shrink-0 ${secondary}`}
                >
                  <span aria-live="polite">
                    {copied === "ok"
                      ? "복사했어요"
                      : copied === "fail"
                        ? "복사하지 못했어요"
                        : "수령 장소 복사"}
                  </span>
                </button>
              </div>
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
          {stat("나눔 완료", `${CURRENT_USER.shareCount}번`)}
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
                {/* 인원이 다 차면 확정. shortcut: 수령 완료를 기록하는 기능이 없어 "수령" 단계는 강조되지 않는다 */}
                <PostCard
                  post={post}
                  status={`${slot.label} 수령 · ${post.joined >= post.people ? "확정" : "모집 중"}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Steps current={post.joined >= post.people ? 1 : 0} />
                    <button type="button" onClick={() => setCancelId(post.id)} className={secondary}>
                      신청 취소
                    </button>
                  </div>
                </PostCard>
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

      <Sheet open={!!cancelPost} onClose={() => setCancelId(undefined)} title="신청을 취소할까요?">
        <p className="mt-3 font-semibold">{cancelPost?.item}</p>
        <p className="mt-1 text-meta">{POLICY.cancelConfirm}</p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => setCancelId(undefined)}
            className="min-h-14 flex-1 rounded-full border border-line bg-card font-semibold"
          >
            닫기
          </button>
          <Button
            className="flex-[2]"
            onClick={() => {
              if (cancelId) cancel(cancelId);
              setCancelId(undefined);
            }}
          >
            신청 취소
          </Button>
        </div>
      </Sheet>
    </main>
  );
}
