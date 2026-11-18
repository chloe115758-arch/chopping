import Link from "next/link";

export default function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center gap-5 px-4 py-20 text-center">
      <p className="text-lg font-semibold">{message}</p>
      {action && (
        <Link
          href={action.href}
          className="rounded-control bg-coral px-6 py-3 font-bold text-brown"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
