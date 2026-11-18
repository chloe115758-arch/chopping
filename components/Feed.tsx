"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, DONGS, type Dong } from "@/lib/mock-data";
import { POLICY } from "@/lib/policy-copy";
import { URGENT_MIN, filterPosts, topicParticle } from "@/lib/share";
import { useStore } from "@/lib/store";
import EmptyState from "./EmptyState";
import PostCard from "./PostCard";

// 필터 값은 주소에 담는다 (/?q=사과&cat=과일·채소&urgent=1). 새로고침·뒤로가기에서도 유지된다.
// replaceState는 Next 라우터와 연동돼서 useSearchParams가 바로 갱신된다 (docs: linking-and-navigating > Native History API)
function setParam(key: string, value: string | null) {
  const params = new URLSearchParams(window.location.search);
  if (value) params.set(key, value);
  else params.delete(key);
  const qs = params.toString();
  window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
}

const chip = (on: boolean) =>
  `min-h-11 shrink-0 rounded-full border px-4 text-meta font-medium ${
    on ? "border-brown bg-brown text-cream" : "border-line bg-card text-brown"
  }`;

// /?empty=1 로 빈 피드 화면을 시연할 수 있다
export default function Feed() {
  const params = useSearchParams();
  const { posts, dong, setDong } = useStore();
  const q = params.get("q")?.trim() ?? "";
  const category = params.get("cat") ?? "";
  const urgent = params.has("urgent");
  // 입력 중인 글자는 따로 들고 있는다 (주소를 거쳐 되돌아오면 한글 조합이 끊길 수 있다)
  const [text, setText] = useState(q);

  const all = params.has("empty") ? [] : filterPosts(posts, { dong });
  const shown = filterPosts(all, { dong, q, category, urgent });

  return (
    <main className="flex flex-col gap-5">
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
      </header>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* 동네는 기본 셀렉트로 고른다. 화살표만 직접 그린다 */}
          <label className="relative flex shrink-0 items-center">
            <span className="sr-only">동네</span>
            <select
              value={dong}
              onChange={(e) => setDong(e.target.value as Dong)}
              className="min-h-11 appearance-none bg-transparent pr-4 text-heading font-semibold"
            >
              {DONGS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute right-0 text-sm">
              ▾
            </span>
          </label>
          <input
            type="search"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setParam("q", e.target.value.trim() || null);
            }}
            aria-label="품목 검색"
            placeholder="품목 검색"
            className="min-h-11 w-full min-w-0 rounded-full border border-line bg-card px-4 text-base placeholder:text-brown-soft"
          />
        </div>
        <p className="text-meta text-brown-soft">
          {POLICY.dongRadius} {POLICY.addressPrivate}
        </p>
        {/* 칩 한 줄: 화면 끝까지 밀어서 가로로 넘긴다. 터치 화면은 스크롤바를 숨기고,
            마우스는 밀어서 넘길 수 없으니 얇은 스크롤바를 보여준다 */}
        <div className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-2 [scrollbar-color:var(--color-line)_transparent] [scrollbar-width:thin] pointer-coarse:pb-0 pointer-coarse:[scrollbar-width:none]">
          <button
            type="button"
            aria-pressed={urgent}
            onClick={() => setParam("urgent", urgent ? null : "1")}
            className={chip(urgent)}
          >
            마감 임박 · {URGENT_MIN / 60}시간 이내
          </button>
          {["", ...CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setParam("cat", c || null)}
              className={chip(category === c)}
            >
              {c || "전체"}
            </button>
          ))}
        </div>
      </div>

      {all.length === 0 ? (
        <EmptyState
          message="아직 조용한 동네예요. 첫 나눔을 올려볼까요?"
          action={{ href: "/new", label: "나눔 올리기" }}
        />
      ) : (
        <section className="flex flex-col gap-3">
          <h1 className="text-heading font-semibold" aria-live="polite">
            {dong} 나눔 {shown.length}개
          </h1>
          {shown.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {shown.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) : q ? (
            <EmptyState
              message={`“${q}”${topicParticle(q)} 아직 없어요. 첫 나눔으로 올려볼까요?`}
              action={{ href: `/new?item=${encodeURIComponent(q)}`, label: "올리러 가기" }}
            />
          ) : (
            <EmptyState
              message="조건에 맞는 나눔이 없어요."
              action={{ href: "/", label: "필터 지우기" }}
            />
          )}
        </section>
      )}
    </main>
  );
}
