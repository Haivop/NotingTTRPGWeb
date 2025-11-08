"use client";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";

interface ReadonlyFieldProps {
  label: string;
  value?: string | null;
  multiline?: boolean;
}

export function ReadonlyField({
  label,
  value,
  multiline = false,
}: ReadonlyFieldProps) {
  const displayValue = value ?? "";
  const FieldComponent = multiline ? Textarea : Input;

  return (
    <div>
      <label className="text-xs uppercase tracking-[0.25em] text-white/45">
        {label}
      </label>
      <FieldComponent
        value={displayValue}
        readOnly
        disabled
        className={cn(
          "mt-2 cursor-not-allowed opacity-80",
          multiline && "min-h-[120px]",
        )}
      />
    </div>
  );
}

