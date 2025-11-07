import { cn } from "@/lib/cn";

interface PillProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Pill({ label, icon, className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/80",
        className,
      )}
    >
      {icon}
      {label}
    </span>
  );
}
