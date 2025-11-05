import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[160px] w-full resize-y rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-400/30",
          className,
        )}
        {...props}
      />
    );
  },
);
