import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-[var(--bg-card)] p-6 shadow-sm",
        "border border-[var(--border)] border-l-[3px] border-l-[var(--card-accent)]",
        "transition-all duration-state",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
