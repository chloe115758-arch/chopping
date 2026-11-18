import { Suspense } from "react";
import NewPostForm from "@/components/NewPostForm";

// 폼이 기본 수령 날짜를 정하려고 현재 시각을 읽어서 Suspense 경계가 필요하다
export default function NewPage() {
  return (
    <Suspense>
      <NewPostForm />
    </Suspense>
  );
}
