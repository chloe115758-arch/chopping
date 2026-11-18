import BlockButton from "./BlockButton";

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
        <BlockButton href={action.href}>{action.label}</BlockButton>
      )}
    </div>
  );
}
