"use client";

import { useEffect, useRef } from "react";

// 아래에서 올라오는 시트. <dialog>라서 Esc 닫기, 포커스 가두기, 뒤 화면 막기는 브라우저가 한다
export default function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="sheet-title"
      onClose={onClose}
      // 안쪽 div 밖(어두운 배경)을 누르면 닫는다
      onClick={(e) => e.target === ref.current && onClose()}
      className="fixed inset-x-0 bottom-0 top-auto m-0 mx-auto w-full max-w-[430px] rounded-t-nav bg-cream text-brown backdrop:bg-brown/50 motion-safe:open:animate-sheet-up"
    >
      <div className="px-gutter pb-6 pt-6">
        <h2 id="sheet-title" className="text-heading font-semibold">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
