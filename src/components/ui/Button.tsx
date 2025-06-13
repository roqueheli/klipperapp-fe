import clsx from "clsx";
import React from "react";

export function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-2xl text-sm font-medium transition-colors",
        "bg-gradient-to-br from-blue-100 to-blue-300 text-black hover:bg-[var(--accent-pink)] hover:text-white",
        "shadow-lg hover:shadow-xl",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--electric-blue)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
