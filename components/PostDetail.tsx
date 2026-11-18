"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { POLICY } from "@/lib/policy-copy";
import { perPerson, shareHistoryText, shareQtyText, won } from "@/lib/share";
import { useStore } from "@/lib/store";
import Button from "./Button";
import Countdown from "./Countdown";
import EmptyState from "./EmptyState";
import PageHeader from "./PageHeader";
import People from "./People";
import PostThumb from "./PostThumb";
import Sheet from "./Sheet";

const label = "text-meta font-medium text-brown-soft";
// 큰 묶음의 제목. 묶음 사이는 선 없이 제목과 넓은 여백으로만 나눈다
const heading = "text-heading font-semibold";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { posts, applied, apply } = useStore();
  const [slotIdx, setSlotIdx] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [justApplied, setJustApplied] = useState(false); // 이 화면에서 방금 신청했을 때만 자리 채움 동작을 보여준다

  const post = posts.find((p) => p.id === id);
  if (!post)
    return (
      <main className="flex flex-col gap-4">
        <PageHeader title="나눔 상세" back="/" />
        <EmptyState
          message="찾을 수 없는 나눔이에요."
          action={{ href: "/", label: "피드로 가기" }}
        />
      </main>
    );

  const share = perPerson(post.totalQty, post.totalPrice, post.people);
  const done = applied.find((a) => a.postId === post.id);
  const isMine = !!post.mine;
  // shortcut: 인원이 찼는지만 본다. 마감 시각이 지난 글의 신청 막기는 실제 마감 시각이 생기면 추가한다.
  const full = post.joined >= post.people;

  return (
    <main className="flex flex-col gap-6 pb-10">
      <PageHeader title="나눔 상세" back="/" />

      {/* 사진은 화면 폭 끝까지 */}
      <PostThumb
        photo={post.photo}
        item={post.item}
        className="-mx-gutter aspect-[4/3] w-[calc(100%+2*var(--spacing-gutter))] max-w-none"
      />

      <section>
        {/* 품목명은 한 단계 덜 굵게: 화면에서 가장 센 글자는 내가 내는 금액 */}
        <h2 className="text-title font-semibold">{post.item}</h2>
        <dl className="mt-2 flex gap-5 text-meta">
          <div className="flex gap-1.5">
            <dt className="text-brown-soft">올린 사람</dt>
            <dd className="font-semibold">{post.author.nickname}</dd>
          </div>
          <div>
            <dt className="sr-only">나눔 이력</dt>
            <dd className="font-semibold">{shareHistoryText(post.author.shareCount)}</dd>
          </div>
        </dl>
      </section>

      {share && (
        <section>
          <p className={label}>내가 내는 금액</p>
          <p className="text-display font-bold leading-tight">{won(share.price)}</p>
          <p className="mt-1 text-meta text-brown-soft">
            총 {won(post.totalPrice)} ÷ {post.people}명 · {shareQtyText(post, share.qty)}
          </p>
        </section>
      )}

      {/* 가격 바로 아래: 이 나눔이 성사되는지(인원, 남은 시간). 줄마다 왼쪽 항목·오른쪽 값으로 맞추고 그 사이만 가는 선으로 나눈다 */}
      <section className="rounded-card border border-line bg-card px-4">
        <div className="py-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-semibold">모집 현황</h2>
            <p className="text-heading font-bold">
              {done && (
                <span className="mr-2 text-meta font-medium text-brown-soft">내 자리 포함</span>
              )}
              {post.joined}/{post.people}명
            </p>
          </div>
          <div className="mt-3">
            <People joined={post.joined} people={post.people} dropLast={justApplied && !sheetOpen} />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-line py-3.5 text-meta">
          <span className="text-brown-soft">신청 마감까지</span>
          <span className="font-semibold">
            <Countdown closesInMin={post.closesInMin} />
          </span>
        </div>
      </section>

      {/* 읽는 정보는 라벨–값 줄로 한 묶음 */}
      <section className="mt-4">
        <h2 className={heading}>나눔 안내</h2>
        <dl className="mt-4 flex flex-col gap-4">
        {[
          ["수령 장소", post.place],
          ["나누는 방법", post.splitMethod],
          ["결제", POLICY.payment],
          ["취소", POLICY.autoCancel],
          ].map(([name, value]) => (
            <div key={name} className="flex gap-3">
              <dt className={`w-20 shrink-0 ${label}`}>{name}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        {/* 노랑 면 위 brown 글자 (대비 8.27) */}
        <p className="mt-5 rounded-card bg-yellow px-4 py-3 text-meta font-semibold">
          {POLICY.safety}
        </p>
      </section>

      <fieldset disabled={!!done || isMine} className="mt-4">
        <legend className={`float-left w-full ${heading}`}>수령 시간</legend>
        <div className="clear-both flex flex-col gap-2 pt-4">
          {post.slots.map((slot, i) => {
            const checked = done ? done.slot.label === slot.label : i === slotIdx;
            return (
              <label
                key={slot.label}
                className={`flex min-h-13 items-center gap-3 rounded-field border px-4 text-base font-medium ${
                  checked ? "border-brown bg-apricot" : "border-line bg-card"
                }`}
              >
                <input
                  type="radio"
                  name="slot"
                  checked={checked}
                  onChange={() => setSlotIdx(i)}
                  className="size-5 accent-brown"
                />
                {slot.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div
        aria-live="polite"
        className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[430px] border-t border-line bg-cream px-gutter pb-4 pt-3"
      >
        {done ? (
          <Button href="/my" className="w-full">
            신청 완료 · 내 활동에서 보기
          </Button>
        ) : isMine ? (
          <p className="py-3 text-center font-semibold">내가 올린 나눔이에요.</p>
        ) : full ? (
          <Button disabled className="w-full">
            모집이 끝났어요
          </Button>
        ) : (
          <Button className="w-full" onClick={() => setSheetOpen(true)}>
            조금만 받을게요{share && ` · ${won(share.price)}`}
          </Button>
        )}
      </div>

      {/* 확인 → 신청하면 같은 시트가 완료 안내로 바뀐다. 시트를 닫으면 내 자리가 내려와 채워진다 */}
      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={done ? "신청했어요." : "이대로 신청할까요?"}
      >
        {done ? (
          <p className="mt-3 text-heading font-semibold">
            {done.slot.label}에 {post.place}에서 만나요.
          </p>
        ) : (
          <dl className="mt-4 flex flex-col gap-3">
            {[
              ["수령 시간", post.slots[slotIdx].label],
              ["수령 장소", post.place],
              ["내가 내는 금액", share ? won(share.price) : "-"],
            ].map(([name, value]) => (
              <div key={name} className="flex justify-between gap-4">
                <dt className="text-meta text-brown-soft">{name}</dt>
                <dd className="text-right font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="mt-4 rounded-field bg-card px-4 py-3 text-meta">{POLICY.payment}</p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="min-h-14 flex-1 rounded-full border border-line bg-card font-semibold"
          >
            닫기
          </button>
          {done ? (
            <Button href="/my" className="flex-[2]">
              내 활동에서 보기
            </Button>
          ) : (
            <Button
              className="flex-[2]"
              onClick={() => {
                apply(post.id, post.slots[slotIdx]);
                setJustApplied(true);
              }}
            >
              신청하기
            </Button>
          )}
        </div>
      </Sheet>
    </main>
  );
}
