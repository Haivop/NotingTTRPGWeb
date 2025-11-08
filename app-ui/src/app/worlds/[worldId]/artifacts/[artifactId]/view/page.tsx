"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ReadonlyField } from "@/components/ui/ReadonlyField";
import { useWorldItem } from "@/hooks/useWorldItem";
import type { ArtifactItem } from "@/lib/types";

type ArtifactFieldKey = keyof Pick<
  ArtifactItem,
  "name" | "detail" | "in_possession_of" | "description"
>;

const ARTIFACT_FIELDS: Array<{
  label: string;
  key: ArtifactFieldKey;
  multiline?: boolean;
}> = [
  { label: "Name", key: "name" },
  { label: "Legendary Detail", key: "detail" },
  { label: "In Possession Of", key: "in_possession_of" },
  { label: "Description", key: "description", multiline: true },
];

export default function ArtifactViewPage() {
  const params = useParams();
  const artifactId = params.artifactId as string | undefined;
  const { item, loading } = useWorldItem(artifactId);

  if (loading) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Loading artifact...
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Artifact not found.
      </PageContainer>
    );
  }

  const artifact = item as ArtifactItem;

  return (
    <PageContainer className="space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-200/80">
          Artifact Ledger
        </p>
        <h1 className="text-3xl font-semibold text-white">{artifact.name}</h1>
        <p className="text-sm text-white/65">
          Guests can review artifact metadata in a locked state. Switch roles to
          amend lore or stewardship.
        </p>
      </header>

      <GlassPanel title="Details">
        <div className="space-y-6">
          {ARTIFACT_FIELDS.map((field) => (
            <ReadonlyField
              key={field.key}
              label={field.label}
              value={artifact[field.key]}
              multiline={field.multiline}
            />
          ))}
        </div>
      </GlassPanel>
    </PageContainer>
  );
}

