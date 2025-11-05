import { cn } from "@/lib/cn";

interface TwoColumnLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sidebarClassName?: string;
  contentClassName?: string;
}

export function TwoColumnLayout({
  sidebar,
  children,
  className,
  sidebarClassName,
  contentClassName,
}: TwoColumnLayoutProps) {
  return (
    <div
      className={cn(
        "page-container grid w-full gap-8 lg:grid-cols-[280px_minmax(0,1fr)]",
        className,
      )}
    >
      <aside
        className={cn(
          "glass-panel h-fit max-h-[80vh] overflow-y-auto p-6 subtle-scrollbar",
          sidebarClassName,
        )}
      >
        {sidebar}
      </aside>
      <div className={cn("flex flex-col gap-8", contentClassName)}>{children}</div>
    </div>
  );
}
