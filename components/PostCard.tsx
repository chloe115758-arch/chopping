import Link from "next/link";
import type { Post } from "@/lib/mock-data";
import { perPerson, shareHistoryText, shareQtyText, won } from "@/lib/share";
import Card from "./Card";
import Countdown from "./Countdown";
import People from "./People";
import PostThumb from "./PostThumb";

// 윗줄: 상태(남은 시간 또는 수령 일정) + 수령 장소(내 글이면 배지) / 아랫줄: 썸네일, 품목, 내 몫 가격, 계산식, 모집 인원·나눔 이력
// children: 카드 아래쪽 칸(진행 표시, 버튼). 카드 전체가 링크라서 버튼은 링크 밖인 여기에 둔다
export default function PostCard({
  post,
  status,
  children,
}: {
  post: Post;
  status?: string;
  children?: React.ReactNode;
}) {
  const share = perPerson(post.totalQty, post.totalPrice, post.people);
  return (
    <Card>
      <Link href={`/posts/${post.id}`} className="block rounded-card p-4">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-3 text-meta text-brown-soft">
          {/* 왼쪽은 줄이지 않고, 긴 장소 이름만 말줄임 */}
          <span className="shrink-0">
            {status ? (
              <span className="font-semibold text-brown">{status}</span>
            ) : (
              <Countdown closesInMin={post.closesInMin} />
            )}
          </span>
          {post.mine ? (
            <span className="rounded-full bg-apricot px-2.5 py-0.5 text-xs font-semibold text-brown">
              내가 올린 글
            </span>
          ) : (
            <span className="truncate">{post.place}</span>
          )}
        </div>
        <div className="flex items-center gap-3 pt-3">
          <PostThumb
            photo={post.photo}
            item={post.item}
            className="size-20 shrink-0 rounded-field"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="line-clamp-3 font-semibold leading-snug">{post.item}</p>
            {share && (
              <>
                <p className="text-lg font-bold leading-tight">
                  {won(share.price)}
                  <span className="ml-2 text-meta font-medium text-brown-soft">
                    {shareQtyText(post, share.qty)}
                  </span>
                </p>
                <p className="text-meta text-brown-soft">
                  총 {won(post.totalPrice)} ÷ {post.people}명
                </p>
              </>
            )}
            <p className="mt-1 flex items-center gap-x-1.5 text-meta text-brown-soft">
              <People small joined={post.joined} people={post.people} />
              {post.joined}/{post.people}명 모집
            </p>
            {/* 누구의 이력인지 알 수 있게 닉네임과 같이 적는다 */}
            <p className="text-meta text-brown-soft">
              {post.author.nickname} · {shareHistoryText(post.author.shareCount)}
            </p>
          </div>
          <span aria-hidden className="text-2xl text-brown-soft">
            ›
          </span>
        </div>
      </Link>
      {children && <div className="border-t border-line px-4 py-3">{children}</div>}
    </Card>
  );
}
