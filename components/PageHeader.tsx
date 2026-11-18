import Link from "next/link";

// 가운데 제목 + 왼쪽 뒤로 가기
export default function PageHeader({ title, back }: { title: string; back?: string }) {
  return (
    <header className="relative flex h-12 items-center justify-center">
      {back && (
        <Link
          href={back}
          aria-label="뒤로 가기"
          className="absolute left-0 flex size-12 items-center text-2xl"
        >
          ←
        </Link>
      )}
      <h1 className="text-heading font-semibold">{title}</h1>
    </header>
  );
}
