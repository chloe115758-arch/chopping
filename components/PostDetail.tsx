"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { ME } from "@/lib/mock-data";
import { perPerson, shareQtyText, won } from "@/lib/share";
import { useStore } from "@/lib/store";
import Button from "./Button";
import Countdown from "./Countdown";
import EmptyState from "./EmptyState";
import PageHeader from "./PageHeader";
import PostThumb from "./PostThumb";

const label = "text-meta font-medium text-brown-soft";
// 섹션 사이를 가르는 두꺼운 띠 (화면 폭 끝까지)
const band = <hr className="-mx-gutter h-2 border-0 bg-line" />;

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { posts, applied, apply } = useStore();
  const [slotIdx, setSlotIdx] = useState(0);

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
  const isMine = post.author.nickname === ME;
  // shortcut: 인원이 찼는지만 본다. 마감 시각이 지난 글의 신청 막기는 실제 마감 시각이 생기면 추가한다.
  const full = post.joined >= post.people;

  return (
    <main className="flex flex-col gap-6">
      <PageHeader title="나눔 상세" back="/" />

      {/* 사진은 화면 폭 끝까지 */}
      <PostThumb
        photo={post.photo}
        item={post.item}
        className="-mx-gutter aspect-[4/3] w-[calc(100%+2*var(--spacing-gutter))] max-w-none"
      />

      <section>
        <h2 className="text-title font-bold">{post.item}</h2>
        <p className="mt-1 text-meta text-brown-soft">
          {post.author.nickname} · 후기 {post.author.reviewCount}개
        </p>
      </section>

      {share && (
        <section>
          <p className={label}>내가 내는 금액</p>
          <s className="block text-meta text-gray">
            <span className="sr-only">전체 가격 </span>
            {won(post.totalPrice)}
          </s>
          <p className="text-display font-bold leading-tight">{won(share.price)}</p>
          <p className="mt-1 text-meta text-brown-soft">
            {won(post.totalPrice)} ÷ {post.people}명 · {shareQtyText(post, share.qty)}
          </p>
          <p className="mt-2 text-meta text-brown-soft">
            신청 <Countdown closesInMin={post.closesInMin} />
          </p>
        </section>
      )}

      <p className="rounded-card bg-yellow/30 px-4 py-3 text-meta font-medium">
        공공장소에서 만나요. 정확한 주소와 실명은 서로 공개되지 않아요.
      </p>

      {band}

      <section>
        <h2 className={`mb-1 ${label}`}>모집 현황</h2>
        <p className="text-heading font-semibold">
          {post.joined}/{post.people}명
          {done && (
            <span className="ml-2 text-meta font-medium text-brown-soft">내 자리 포함</span>
          )}
        </p>
      </section>

      {band}

      <section>
        <h2 className={label}>수령 장소</h2>
        <p className="mt-1 text-heading font-semibold">{post.place}</p>
      </section>

      {band}

      <fieldset disabled={!!done || isMine}>
        <legend className={`float-left w-full ${label}`}>수령 시간</legend>
        <div className="clear-both flex flex-col gap-2 pt-2">
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
          <p className="rounded-card bg-apricot p-4 text-center text-heading font-semibold">
            신청했어요. {done.slot.label}에 만나요!
          </p>
        ) : isMine ? (
          <p className="py-3 text-center font-semibold">내가 올린 나눔이에요.</p>
        ) : full ? (
          <Button disabled className="w-full">
            모집이 끝났어요
          </Button>
        ) : (
          <Button className="w-full" onClick={() => apply(post.id, post.slots[slotIdx])}>
            조금만 받을게요
          </Button>
        )}
      </div>
    </main>
  );
}
