"use client";

import { useState } from "react";
import Button from "./Button";

// 화면 사진은 실제 앱을 캡처한 것이라, 화면이 크게 바뀌면 public/onboarding/ 사진도 다시 찍어야 한다
const SLIDES = [
  {
    image: "/onboarding/1-feed.jpg",
    title: "우리 동네 나눔을 한눈에",
    body: "동네를 고르고, 검색과 카테고리로 필요한 것만 찾아요.",
  },
  {
    image: "/onboarding/2-detail.jpg",
    title: "내 몫만큼만 내요",
    body: "전체 가격을 인원수로 나눈 금액과 모집 현황을 바로 확인해요.",
  },
  {
    image: "/onboarding/3-apply.jpg",
    title: "확인하고 신청해요",
    body: "수령 시간과 장소, 낼 금액을 한 번 더 보고 신청해요.",
  },
  {
    image: "/onboarding/4-my.jpg",
    title: "수령까지 놓치지 않게",
    body: "내 활동에서 신청, 확정, 수령 단계와 다음 일정을 챙겨요.",
  },
];

// 스플래시 다음에 한 번 보여주는 기능 소개. "다음"으로 넘기고 마지막에 "나눔 시작하기"로 메인에 들어간다
export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const last = step === SLIDES.length - 1;

  return (
    <div className="mx-auto flex h-full w-full max-w-[430px] flex-col px-gutter pb-8 pt-4">
      <div className="flex min-h-11 items-center justify-between">
        {/* 지금 몇 번째인지: 긴 알약이 현재 화면 */}
        <ol className="flex gap-1.5" aria-label={`${SLIDES.length}개 중 ${step + 1}번째`}>
          {SLIDES.map((s, i) => (
            <li
              key={s.image}
              className={`h-2 rounded-full ${i === step ? "w-6 bg-brown" : "w-2 bg-line"}`}
            />
          ))}
        </ol>
        {!last && (
          <button type="button" onClick={onDone} className="min-h-11 px-2 text-meta text-brown-soft">
            건너뛰기
          </button>
        )}
      </div>

      {/* 캡처 화면: 남는 높이를 다 쓰되 비율은 지킨다 */}
      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- 화면 캡처 4장뿐이라 최적화 불필요 */}
        <img
          key={slide.image}
          src={slide.image}
          alt=""
          width={780}
          height={1240}
          className="h-full w-auto max-w-full rounded-card border border-line object-contain shadow-card"
        />
      </div>

      <div aria-live="polite" className="pb-6 text-center">
        <h2 className="text-title font-bold">{slide.title}</h2>
        <p className="mt-2 text-brown-soft">{slide.body}</p>
      </div>

      <Button className="w-full" onClick={last ? onDone : () => setStep(step + 1)}>
        {last ? "나눔 시작하기" : "다음"}
      </Button>
    </div>
  );
}
