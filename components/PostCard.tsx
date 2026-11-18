import Link from "next/link";
import { CURRENT_USER, type Post } from "@/lib/mock-data";
import { distance, perPerson, shareQtyText, won } from "@/lib/share";
import Card from "./Card";
import Countdown from "./Countdown";
import PostThumb from "./PostThumb";

// 윗줄: 상태(남은 시간 또는 수령 일정) + 거리(내 글이면 배지) / 아랫줄: 썸네일, 품목, 내 몫 가격, 계산식, 모집 인원·후기
export default function PostCard({ post, status }: { post: Post; status?: string }) {
  const share = perPerson(post.totalQty, post.totalPrice, post.people);
  const isMine = post.author.nickname === CURRENT_USER.nickname;
  return (
    <Card>
      <Link href={`/posts/${post.id}`} className="block rounded-card p-4">
        <div className="flex items-center justify-between border-b border-line pb-3 text-meta text-brown-soft">
          {status ? (
            <span className="font-semibold text-brown">{status}</span>
          ) : (
            <Countdown closesInMin={post.closesInMin} />
          )}
          {isMine ? (
            <span className="rounded-full bg-apricot px-2.5 py-0.5 text-xs font-semibold text-brown">
              내가 올린 글
            </span>
          ) : (
            <span>{distance(post.distanceM)}</span>
          )}
        </div>
        <div className="flex items-center gap-3 pt-3">
          <PostThumb
            photo={post.photo}
            item={post.item}
            className="size-20 shrink-0 rounded-field"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="line-clamp-2 break-keep font-semibold leading-snug">{post.item}</p>
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
            <p className="mt-1 text-meta text-brown-soft">
              {post.joined}/{post.people}명 모집 · 후기 {post.author.reviewCount}개
            </p>
          </div>
          <span aria-hidden className="text-2xl text-brown-soft">
            ›
          </span>
        </div>
      </Link>
    </Card>
  );
}
