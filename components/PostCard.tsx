import Link from "next/link";
import type { Post } from "@/lib/mock-data";
import { distance, perPerson, shareQtyText, won } from "@/lib/share";
import Block from "./Block";
import Capacity from "./Capacity";
import Countdown from "./Countdown";
import PostThumb from "./PostThumb";

export default function PostCard({ post }: { post: Post }) {
  const share = perPerson(post.totalQty, post.totalPrice, post.people);
  return (
    <Block tone="weak">
      <Link href={`/posts/${post.id}`} className="flex gap-4 rounded-block p-3">
        <PostThumb
          photo={post.photo}
          item={post.item}
          className="size-24 shrink-0 rounded-block"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-sm text-brown-soft">{post.item}</p>
          {share && (
            <p className="text-xl font-bold leading-tight">
              <s className="block text-xs font-normal text-gray">
                <span className="sr-only">전체 가격 </span>
                {won(post.totalPrice)}
              </s>
              {won(share.price)}
              <span className="ml-2 text-sm font-medium text-brown-soft">
                {shareQtyText(post, share.qty)}
              </span>
            </p>
          )}
          <p className="flex gap-2 text-sm text-brown-soft">
            <span>{distance(post.distanceM)}</span>
            <span aria-hidden>·</span>
            <Countdown closesInMin={post.closesInMin} />
          </p>
          <div className="text-sm text-brown-soft">
            <Capacity joined={post.joined} people={post.people} />
          </div>
        </div>
      </Link>
    </Block>
  );
}
