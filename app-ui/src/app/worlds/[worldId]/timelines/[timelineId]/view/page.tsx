"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ReadonlyField } from "@/components/ui/ReadonlyField";
import { useWorldItem } from "@/hooks/useWorldItem";
import type { TimelineItem } from "@/lib/types";

type TimelineFieldKey = keyof Pick<
  TimelineItem,
  "name" | "detail" | "status" | "description"
>;

const TIMELINE_FIELDS: Array<{
  label: string;
  key: TimelineFieldKey;
  multiline?: boolean;
}> = [
  { label: "Event Title", key: "name" },
  { label: "Era / Detail", key: "detail" },
  { label: "Status", key: "status" },
  { label: "Description", key: "description", multiline: true },
];

export default function TimelineViewPage() {
  const params = useParams();
  const timelineId = params.timelineId as string | undefined;
  const { item, loading } = useWorldItem(timelineId);

  if (loading) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Loading timeline entry...
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Timeline entry not found.
      </PageContainer>
    );
  }

  const timeline = item as TimelineItem;

  return (
    <PageContainer className="space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-200/80">
          Timeline Entry
        </p>
        <h1 className="text-3xl font-semibold text-white">{timeline.name}</h1>
        <p className="text-sm text-white/65">
          Guests receive a locked snapshot of this era. Switch roles to edit the
          chronology.
        </p>
      </header>

      <GlassPanel title="Details">
        <div className="space-y-6">
          {TIMELINE_FIELDS.map((field) => (
            <ReadonlyField
              key={field.key}
              label={field.label}
              value={timeline[field.key]}
              multiline={field.multiline}
            />
          ))}
        </div>
      </GlassPanel>
    </PageContainer>
  );
}

