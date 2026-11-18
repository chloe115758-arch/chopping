"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import { CURRENT_USER, DONGS, posts as seed, type Dong, type Post, type Slot } from "./mock-data";
import { isValidNickname } from "./share";

type Applied = { postId: string; slot: Slot };

type Store = {
  posts: Post[];
  applied: Applied[];
  apply: (postId: string, slot: Slot) => void;
  cancel: (postId: string) => void;
  addPost: (post: Post) => void;
  dong: Dong;
  setDong: (dong: Dong) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
};

const Ctx = createContext<Store | null>(null);

// 동네와 닉네임은 브라우저(localStorage)에 둔다: 새로고침하거나 다른 화면에 다녀와도 유지된다.
// 저장소를 못 쓰는 환경(사생활 보호 모드 등)에서는 메모리 값으로 이번 방문 동안만 유지한다
function persisted<T extends string>(key: string, fallback: T, valid: (value: string) => boolean) {
  let memory: T | null = null;
  const listeners = new Set<() => void>();
  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    read: (): T => {
      if (memory) return memory;
      try {
        const saved = localStorage.getItem(key);
        if (saved && valid(saved)) return saved as T;
      } catch {}
      return fallback;
    },
    write: (value: T) => {
      memory = value;
      try {
        localStorage.setItem(key, value);
      } catch {}
      listeners.forEach((listener) => listener());
    },
  };
}
const dongStore = persisted<Dong>("chopping-dong", CURRENT_USER.town, (v) =>
  DONGS.includes(v as Dong),
);
const nicknameStore = persisted<string>("chopping-nickname", CURRENT_USER.nickname, isValidNickname);

const byId = (id: string) => seed.find((p) => p.id === id)!;

// shortcut: 글과 신청은 메모리 상태라 새로고침하면 초기화됨. DB를 붙일 때 이 파일만 교체한다.
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [rawPosts, setPosts] = useState(seed);
  // 처음부터 신청해 둔 글 두 개: 모집 중(3번)과 인원이 다 찬 확정(12번)
  const [applied, setApplied] = useState<Applied[]>([
    { postId: "3", slot: byId("3").slots[0] },
    { postId: "12", slot: byId("12").slots[0] },
  ]);
  // 서버 렌더에서는 기본 동네로 그리고, 브라우저에서 저장된 동네로 바뀐다
  const dong = useSyncExternalStore(dongStore.subscribe, dongStore.read, () => CURRENT_USER.town);
  const nickname = useSyncExternalStore(
    nicknameStore.subscribe,
    nicknameStore.read,
    () => CURRENT_USER.nickname,
  );
  // 내가 올린 글에는 항상 지금 닉네임이 보이게 한다
  const posts = rawPosts.map((p) => (p.mine ? { ...p, author: { ...p.author, nickname } } : p));

  const bump = (postId: string, by: number) =>
    setPosts((ps) => ps.map((p) => (p.id === postId ? { ...p, joined: p.joined + by } : p)));
  const apply = (postId: string, slot: Slot) => {
    if (applied.some((a) => a.postId === postId)) return;
    setApplied((a) => [...a, { postId, slot }]);
    bump(postId, 1); // 신청하면 내 자리가 하나 채워진다
  };
  const cancel = (postId: string) => {
    if (!applied.some((a) => a.postId === postId)) return;
    setApplied((a) => a.filter((x) => x.postId !== postId));
    bump(postId, -1); // 취소하면 내 자리가 비워진다
  };
  const addPost = (post: Post) => setPosts((p) => [post, ...p]);
  return (
    <Ctx
      value={{
        posts,
        applied,
        apply,
        cancel,
        addPost,
        dong,
        setDong: dongStore.write,
        nickname,
        setNickname: nicknameStore.write,
      }}
    >
      {children}
    </Ctx>
  );
}

export function useStore() {
  const store = useContext(Ctx);
  if (!store) throw new Error("StoreProvider 밖에서 useStore를 호출했어요");
  return store;
}
