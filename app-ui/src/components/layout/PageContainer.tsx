import type { ElementType } from "react";
import { cn } from "@/lib/cn";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
}

export function PageContainer({
  children,
  className,
  as: Element = "div",
}: PageContainerProps) {
  const Component = Element as ElementType;
  return (
    <Component className={cn("page-container w-full", className)}>
      {children}
    </Component>
  );
}
