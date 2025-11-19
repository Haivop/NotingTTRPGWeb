"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ReadonlyField } from "@/components/ui/ReadonlyField";
import { useWorldItem } from "@/hooks/useWorldItem";
import type { FactionItem } from "@/lib/types";

type FactionFieldKey = keyof Pick<
  FactionItem,
  "name" | "detail" | "description"
>;

const FACTION_FIELDS: Array<{
  label: string;
  key: FactionFieldKey;
  multiline?: boolean;
}> = [
  { label: "Name", key: "name" },
  { label: "Motto / Detail", key: "detail" },
  { label: "Description", key: "description", multiline: true },
];

export default function FactionViewPage() {
  const params = useParams();
  const factionId = params.factionId as string | undefined;
  const { item, loading } = useWorldItem(factionId);

  if (loading) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Loading faction...
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Faction not found.
      </PageContainer>
    );
  }

  const faction = item as FactionItem;

  return (
    <PageContainer className="space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-200/80">
          Faction Scroll
        </p>
        <h1 className="text-3xl font-semibold text-white">{faction.name}</h1>
        <p className="text-sm text-white/65">
          Guests can inspect the faction profile with inputs locked. Owners and
          co-authors can update charters and rosters.
        </p>
      </header>

      <GlassPanel title="Details">
        <div className="space-y-6">
          {FACTION_FIELDS.map((field) => (
            <ReadonlyField
              key={field.key}
              label={field.label}
              value={faction[field.key]}
              multiline={field.multiline}
            />
          ))}
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
