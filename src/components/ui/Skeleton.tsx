import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-[var(--cyber-gray)]",
        className
      )}
    />
  );
}
