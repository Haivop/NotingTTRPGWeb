'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.HTMLProps<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        'h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-base text-white/90 placeholder:text-white/40 focus:border-purple-400/70 focus:bg-purple-900/20 focus:outline-none focus:ring-0',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';