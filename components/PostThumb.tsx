"use client";

import { useState } from "react";

// 사진은 쇼핑몰 캡처라 위쪽(상품 사진)만 보이게 object-top으로 자른다.
// 사진이 없거나 불러오지 못하면 품목 첫 글자가 들어간 색 타일을 보여준다
export default function PostThumb({
  photo,
  item,
  className = "",
}: {
  photo?: string;
  item: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!photo || failed)
    return (
      <div
        aria-hidden
        className={`flex items-center justify-center bg-coral/25 text-2xl font-bold text-brown ${className}`}
      >
        {item[0]}
      </div>
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 더미 사진이라 최적화 불필요
    <img
      src={photo}
      alt=""
      onError={() => setFailed(true)}
      className={`object-cover object-top ${className}`}
    />
  );
}
