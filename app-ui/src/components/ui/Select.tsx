import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-200/70 focus:ring-2 focus:ring-purple-400/30",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
