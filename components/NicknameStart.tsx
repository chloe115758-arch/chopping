"use client";

import { useState } from "react";
import { CURRENT_USER, SUGGESTED_NICKNAMES } from "@/lib/mock-data";
import { isValidNickname } from "@/lib/share";
import { useStore } from "@/lib/store";
import Button from "./Button";

const SHOWN = 3; // 추천은 세 개씩 보여주고 "다른 추천"으로 넘긴다

// 로그인 없이 닉네임만 정하고 시작한다. 추천 닉네임이 미리 들어 있어서 그대로 시작할 수 있다
export default function NicknameStart({ onDone }: { onDone: () => void }) {
  const { nickname, setNickname } = useStore();
  const [offset, setOffset] = useState(0);
  // 전에 정한 닉네임이 있으면 그걸, 없으면 첫 추천을 채워 둔다
  const [name, setName] = useState(
    nickname !== CURRENT_USER.nickname ? nickname : SUGGESTED_NICKNAMES[0],
  );
  const valid = isValidNickname(name);
  const suggestions = Array.from(
    { length: SHOWN },
    (_, i) => SUGGESTED_NICKNAMES[(offset + i) % SUGGESTED_NICKNAMES.length],
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        setNickname(name);
        onDone();
      }}
      className="mx-auto flex h-full w-full max-w-[430px] flex-col px-gutter pb-8 pt-20"
    >
      <h2 className="text-title font-bold">닉네임만 정하면 바로 시작해요</h2>
      <p className="mt-2 text-brown-soft">
        로그인과 회원가입은 없어요. 실명과 연락처도 받지 않아요.
      </p>

      <label className="mt-8 text-meta font-medium text-brown-soft">
        닉네임
        <input
          value={name}
          onChange={(e) => setName(e.target.value.trim())}
          maxLength={10}
          aria-invalid={!valid}
          aria-describedby="nickname-rule"
          className="mt-1.5 min-h-13 w-full rounded-field border border-line bg-card px-4 text-base font-medium text-brown"
        />
      </label>
      <p
        id="nickname-rule"
        className={`mt-2 text-meta ${valid ? "text-brown-soft" : "font-semibold text-coral-deep"}`}
      >
        한글, 영문, 숫자로 2~10자
      </p>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-meta font-medium text-brown-soft">추천 닉네임</p>
        <button
          type="button"
          onClick={() =>
            setOffset((offset + SHOWN) % SUGGESTED_NICKNAMES.length)
          }
          className="min-h-11 px-2 text-meta font-semibold"
        >
          다른 추천
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={s === name}
            onClick={() => setName(s)}
            className={`min-h-11 rounded-full border px-4 text-meta font-medium ${
              s === name
                ? "border-brown bg-brown text-cream"
                : "border-line bg-card text-brown"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <Button type="submit" disabled={!valid} className="mt-auto w-full">
        이 닉네임으로 시작하기
      </Button>
    </form>
  );
}
