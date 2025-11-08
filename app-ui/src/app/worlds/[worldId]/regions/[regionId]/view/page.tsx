"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ReadonlyField } from "@/components/ui/ReadonlyField";
import { useWorldItem } from "@/hooks/useWorldItem";
import type { RegionItem } from "@/lib/types";

type RegionFieldKey = keyof Pick<
  RegionItem,
  "name" | "detail" | "location_type" | "faction" | "description"
>;

const REGION_FIELDS: Array<{
  label: string;
  key: RegionFieldKey;
  multiline?: boolean;
}> = [
  { label: "Name", key: "name" },
  { label: "Signature Detail", key: "detail" },
  { label: "Primary Faction", key: "faction" },
  { label: "Region Type", key: "location_type" },
  { label: "Description", key: "description", multiline: true },
];

export default function RegionViewPage() {
  const params = useParams();
  const regionId = params.regionId as string | undefined;
  const { item, loading } = useWorldItem(regionId);

  if (loading) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Loading region...
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Region not found.
      </PageContainer>
    );
  }

  const region = item as RegionItem;

  return (
    <PageContainer className="space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-200/80">
          Region Archive
        </p>
        <h1 className="text-3xl font-semibold text-white">{region.name}</h1>
        <p className="text-sm text-white/65">
          This region dossier is read-only for Guests. Authors and Co-Authors
          can change these values after switching roles.
        </p>
      </header>

      <GlassPanel title="Details">
        <div className="space-y-6">
          {REGION_FIELDS.map((field) => (
            <ReadonlyField
              key={field.key}
              label={field.label}
              value={region[field.key]}
              multiline={field.multiline}
            />
          ))}
        </div>
      </GlassPanel>
    </PageContainer>
  );
}

