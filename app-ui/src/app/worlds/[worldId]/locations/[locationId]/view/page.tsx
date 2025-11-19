"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ReadonlyField } from "@/components/ui/ReadonlyField";
import { useWorldItem } from "@/hooks/useWorldItem";
import type { LocationItem } from "@/lib/types";

type LocationFieldKey = keyof Pick<
  LocationItem,
  "name" | "detail" | "location_type" | "faction" | "description"
>;

const LOCATION_FIELDS: Array<{
  label: string;
  key: LocationFieldKey;
  multiline?: boolean;
}> = [
  { label: "Name", key: "name" },
  { label: "Signature Detail", key: "detail" },
  { label: "Controlling Faction", key: "faction" },
  { label: "Location Type", key: "location_type" },
  { label: "Description", key: "description", multiline: true },
];

export default function LocationViewPage() {
  const params = useParams();
  const locationId = params.locationId as string | undefined;
  const { item, loading } = useWorldItem(locationId);

  if (loading) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Loading location...
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Location not found.
      </PageContainer>
    );
  }

  const location = item as LocationItem;

  return (
    <PageContainer className="space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-200/80">
          Location Archive
        </p>
        <h1 className="text-3xl font-semibold text-white">{location.name}</h1>
        <p className="text-sm text-white/65">
          Guests browse immutable lore only. Editable controls unlock once the owner
          invites you as a co-author.
        </p>
      </header>

      <GlassPanel title="Details">
        <div className="space-y-6">
          {LOCATION_FIELDS.map((field) => (
            <ReadonlyField
              key={field.key}
              label={field.label}
              value={location[field.key]}
              multiline={field.multiline}
            />
          ))}
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
