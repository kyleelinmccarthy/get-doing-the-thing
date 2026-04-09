"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "success" | "neutral" | "muted" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  success:
    "bg-[var(--success)] text-[var(--btn-text)] hover:brightness-95",
  neutral:
    "bg-[var(--accent)] text-[var(--btn-text)] hover:bg-[var(--accent-hover)]",
  muted:
    "bg-[var(--muted)] text-[var(--btn-text)] hover:brightness-95",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]",
  danger:
    "bg-red-600 text-white hover:bg-red-700",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "neutral", fullWidth = false, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-btn px-6 py-4 text-base font-medium transition-all duration-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
