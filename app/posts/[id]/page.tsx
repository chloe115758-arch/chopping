import { Suspense } from "react";
import PostDetail from "@/components/PostDetail";

// PostDetail이 useParams로 글 번호를 읽어서 Suspense 경계가 필요하다
export default function PostPage() {
  return (
    <Suspense>
      <PostDetail />
    </Suspense>
  );
}
