"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Button from "./Button";
import NicknameStart from "./NicknameStart";
import Onboarding from "./Onboarding";

// 탭을 연 뒤 처음 한 번만 보여준다. 새로고침이나 화면 이동에서는 다시 뜨지 않는다
const KEY = "chopping-splash-seen";
const seen = () => {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};
const noop = () => () => {};

// splash.gif: 16장 × 180ms, 한 번만 재생. 10번째 장(1620ms)부터 블록 친구들이 웃는다
const SMILE_MS = 1620; // 웃는 순간: 로고가 뜬다
const END_MS = 2880; // 재생 끝: "서비스 둘러보기" 버튼이 뜬다

const hidden = "pointer-events-none translate-y-3 opacity-0";

export default function Splash() {
  const alreadySeen = useSyncExternalStore(noop, seen, () => false);
  const [phase, setPhase] = useState<
    "play" | "smile" | "end" | "onboard" | "nickname" | "gone"
  >("play");
  const img = useRef<HTMLImageElement>(null);

  const finish = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    setPhase("gone");
  };

  // GIF를 다 불러와 재생이 시작된 순간부터 센다 (늦게 불러와도 웃는 장면과 로고가 맞도록)
  useEffect(() => {
    const el = img.current;
    if (!el) return;
    let ids: ReturnType<typeof setTimeout>[] = [];
    const begin = () => {
      if (ids.length) return;
      ids = [
        setTimeout(
          () => setPhase((p) => (p === "play" ? "smile" : p)),
          SMILE_MS,
        ),
        setTimeout(
          () => setPhase((p) => (p === "play" || p === "smile" ? "end" : p)),
          END_MS,
        ),
      ];
    };
    // GIF를 못 불러와도 버튼은 떠야 메인으로 갈 수 있다
    const fail = () =>
      setPhase((p) => (p === "play" || p === "smile" ? "end" : p));
    if (el.complete) begin();
    else el.addEventListener("load", begin, { once: true });
    el.addEventListener("error", fail, { once: true });
    return () => {
      ids.forEach(clearTimeout);
      el.removeEventListener("load", begin);
      el.removeEventListener("error", fail);
    };
  }, []);

  if (alreadySeen || phase === "gone") return null;
  return (
    <div
      role="dialog"
      aria-modal
      aria-label="chopping 시작 화면"
      className="fixed inset-0 z-50 bg-cream"
    >
      {phase === "nickname" ? (
        <NicknameStart onDone={finish} />
      ) : phase === "onboard" ? (
        <Onboarding onDone={() => setPhase("nickname")} />
      ) : (
        <div className="mx-auto flex h-full w-full max-w-[430px] flex-col items-center px-gutter pb-8 pt-20">
          {/* 위: 글자 로고(캐릭터 없음)와 한 줄 소개. 웃는 순간에 같이 뜬다 */}
          <div
            className={`flex flex-col items-center gap-3 transition duration-500 ${
              phase === "play" ? hidden : ""
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG 로고라 최적화 불필요 */}
            <img
              src="/wordmark.svg"
              alt="chopping"
              width={723}
              height={192}
              className="h-auto w-64"
            />
            <p className="text-heading font-semibold">
              필요한 만큼만 이웃과 나눠 사요
            </p>
          </div>
          {/* 가운데: GIF. 배경이 크림색과 아주 조금 달라서 가장자리를 흐리게 녹인다 */}
          <div className="flex flex-1 items-center">
            {/* "동작 줄이기" 설정이면 GIF만 숨긴다. 로고와 버튼은 같은 시간에 뜬다 */}
            {/* eslint-disable-next-line @next/next/no-img-element -- 움직이는 GIF라 최적화하면 안 된다 */}
            <img
              ref={img}
              src="/splash.gif"
              alt=""
              width={308}
              height={308}
              className="size-64 motion-reduce:invisible [mask-image:radial-gradient(closest-side,black_90%,transparent)]"
            />
          </div>
          {/* 아래: GIF가 끝나면 버튼이 뜬다 */}
          <Button
            onClick={() => setPhase("onboard")}
            tabIndex={phase === "end" ? 0 : -1}
            className={`w-full transition duration-500 ${phase === "end" ? "" : hidden}`}
          >
            서비스 둘러보기
          </Button>
        </div>
      )}
    </div>
  );
}
