import React from "react";
import { cn } from "@/lib/cn";

interface GlassPanelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
}

export function GlassPanel({
  title,
  description,
  children,
  className,
  headerContent,
  ...props
}: GlassPanelProps) {
  return (
    <section
      {...props}
      className={cn(
        "glass-panel relative overflow-hidden border border-white/10 p-6 md:p-8",
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      {title && (
        <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-base tracking-[0.3em] text-purple-100">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-white/60">{description}</p>
            )}
          </div>
          {headerContent}
        </header>
      )}
      {children}
    </section>
  );
}
