export function formatRelativeDate(date: string) {
  const then = new Date(date);
  const now = new Date();

  const diff = Math.floor(
    (now.getTime() - then.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;

  return then.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      then.getFullYear() !== now.getFullYear()
        ? "numeric"
        : undefined,
  });
}