import Button from "./Button";
import Card from "./Card";

export default function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: { href: string; label: string };
}) {
  return (
    <Card className="flex flex-col items-center gap-6 px-6 py-14 text-center">
      <p className="text-heading font-medium">{message}</p>
      {action && <Button href={action.href}>{action.label}</Button>}
    </Card>
  );
}
