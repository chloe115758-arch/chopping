import { Suspense } from "react";
import Feed from "@/components/Feed";

// Feed가 useSearchParams를 써서 Suspense 경계가 필요하다
export default function Home() {
  return (
    <Suspense>
      <Feed />
    </Suspense>
  );
}
