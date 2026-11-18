export default function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-card bg-card shadow-card ${className}`}>{children}</div>
  );
}
