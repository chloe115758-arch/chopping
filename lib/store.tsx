"use client";

import { createContext, useContext, useState } from "react";
import { posts as seed, type Post, type Slot } from "./mock-data";

type Applied = { postId: string; slot: Slot };

type Store = {
  posts: Post[];
  applied: Applied[];
  apply: (postId: string, slot: Slot) => void;
  addPost: (post: Post) => void;
};

const Ctx = createContext<Store | null>(null);

// shortcut: 메모리 상태라 새로고침하면 초기화됨. DB를 붙일 때 이 파일만 교체한다.
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState(seed);
  const [applied, setApplied] = useState<Applied[]>([
    { postId: "3", slot: seed[2].slots[0] },
  ]);
  const apply = (postId: string, slot: Slot) => {
    if (applied.some((a) => a.postId === postId)) return;
    setApplied((a) => [...a, { postId, slot }]);
    // 신청하면 내 자리가 하나 채워진다
    setPosts((ps) => ps.map((p) => (p.id === postId ? { ...p, joined: p.joined + 1 } : p)));
  };
  const addPost = (post: Post) => setPosts((p) => [post, ...p]);
  return <Ctx value={{ posts, applied, apply, addPost }}>{children}</Ctx>;
}

export function useStore() {
  const store = useContext(Ctx);
  if (!store) throw new Error("StoreProvider 밖에서 useStore를 호출했어요");
  return store;
}
