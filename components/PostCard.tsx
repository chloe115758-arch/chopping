import Link from "next/link";
import type { Post } from "@/lib/mock-data";
import { distance, perPerson, shareQtyText, won } from "@/lib/share";
import Card from "./Card";
import Countdown from "./Countdown";
import PostThumb from "./PostThumb";

// 윗줄: 상태(남은 시간 또는 수령 일정) + 거리 / 아랫줄: 썸네일, 품목, 내 몫 가격, 모집 인원
export default function PostCard({ post, status }: { post: Post; status?: string }) {
  const share = perPerson(post.totalQty, post.totalPrice, post.people);
  return (
    <Card>
      <Link href={`/posts/${post.id}`} className="block rounded-card p-4">
        <div className="flex items-center justify-between border-b border-line pb-3 text-meta text-brown-soft">
          {status ? (
            <span className="font-semibold text-brown">{status}</span>
          ) : (
            <Countdown closesInMin={post.closesInMin} />
          )}
          <span>{distance(post.distanceM)}</span>
        </div>
        <div className="flex items-center gap-3 pt-3">
          <PostThumb
            photo={post.photo}
            item={post.item}
            className="size-20 shrink-0 rounded-field"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate font-semibold">{post.item}</p>
            {share && (
              <p className="text-lg font-bold leading-tight">
                <s className="block text-xs font-normal text-gray">
                  <span className="sr-only">전체 가격 </span>
                  {won(post.totalPrice)}
                </s>
                {won(share.price)}
                <span className="ml-2 text-meta font-medium text-brown-soft">
                  {shareQtyText(post, share.qty)}
                </span>
              </p>
            )}
            <p className="mt-1 text-meta text-brown-soft">
              {post.joined}/{post.people}명 모집
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
