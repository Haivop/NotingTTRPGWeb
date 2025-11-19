"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ReadonlyField } from "@/components/ui/ReadonlyField";
import { useWorldItem } from "@/hooks/useWorldItem";
import type { ContinentItem } from "@/lib/types";

type ContinentFieldKey = keyof Pick<
  ContinentItem,
  "name" | "detail" | "location_type" | "faction" | "description"
>;

const CONTINENT_FIELDS: Array<{
  label: string;
  key: ContinentFieldKey;
  multiline?: boolean;
}> = [
  { label: "Name", key: "name" },
  { label: "Primary Trait", key: "detail" },
  { label: "Dominant Faction", key: "faction" },
  { label: "Region Type", key: "location_type" },
  { label: "Description", key: "description", multiline: true },
];

export default function ContinentViewPage() {
  const params = useParams();
  const continentId = params.continentId as string | undefined;
  const { item, loading } = useWorldItem(continentId);

  if (loading) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Loading continent...
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Continent not found.
      </PageContainer>
    );
  }

  const continent = item as ContinentItem;

  return (
    <PageContainer className="space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-200/80">
          Continent Profile
        </p>
        <h1 className="text-3xl font-semibold text-white">
          {continent.name}
        </h1>
        <p className="text-sm text-white/65">
          Guests can browse immutable data for this continent. Editing is reserved for
          the owner and trusted co-authors.
        </p>
      </header>

      <GlassPanel title="Details">
        <div className="space-y-6">
          {CONTINENT_FIELDS.map((field) => (
            <ReadonlyField
              key={field.key}
              label={field.label}
              value={continent[field.key]}
              multiline={field.multiline}
            />
          ))}
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
