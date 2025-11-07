import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "ghost" | "danger" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-purple-500/90 via-purple-400/80 to-rose-400/80 text-sm font-semibold uppercase tracking-[0.24em] text-amber-100 shadow-[0_15px_45px_rgba(126,58,237,0.45)] hover:from-purple-400/90 hover:to-rose-300/80",
  ghost:
    "bg-white/10 text-sm font-semibold uppercase tracking-[0.18em] text-white/80 hover:bg-white/15",
  danger:
    "bg-gradient-to-r from-rose-500/90 to-orange-400/80 text-sm font-semibold uppercase tracking-[0.24em] text-white hover:from-rose-400 hover:to-orange-300",
  outline:
    "border border-white/30 bg-transparent text-sm font-semibold uppercase tracking-[0.2em] text-white/80 hover:border-white/60 hover:text-white",
};

const baseClasses =
  "inline-flex min-w-[160px] items-center justify-center rounded-full px-6 py-3 transition focus:outline-none focus:ring-2 focus:ring-purple-300/40";

export function buttonClasses(variant: ButtonVariant = "primary") {
  return cn(baseClasses, variants[variant]);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ children, className, variant = "primary", ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(buttonClasses(variant), className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
