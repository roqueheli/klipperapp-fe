import clsx from "clsx";
import React from "react";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full px-4 py-2 rounded-xl text-sm bg-[var(--cyber-gray)] text-[var(--soft-white)] border border-[var(--electric-blue)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent",
        className
      )}
      {...props}
    />
  );
}
