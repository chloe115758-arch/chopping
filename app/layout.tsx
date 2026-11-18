import type { Metadata } from "next";
import { Suspense } from "react";
import BottomNav from "@/components/BottomNav";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "chopping",
  description: "대용량 상품을 이웃과 쪼개서 사는 소량 공동구매",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-cream font-sans text-body tracking-[-0.01em] text-brown">
        <link
          rel="stylesheet"
          precedence="default"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <StoreProvider>
          {/* 모바일 390px 기준, 데스크톱은 가운데 정렬 */}
          <div className="mx-auto min-h-dvh w-full max-w-[430px] px-gutter pb-36 pt-6">
            {children}
          </div>
          {/* usePathname을 쓰는 컴포넌트는 Suspense 경계가 필요하다 */}
          <Suspense>
            <BottomNav />
          </Suspense>
        </StoreProvider>
      </body>
    </html>
  );
}
