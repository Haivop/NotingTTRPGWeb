"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ReadonlyField } from "@/components/ui/ReadonlyField";
import { useWorldItem } from "@/hooks/useWorldItem";
import type { CharacterItem } from "@/lib/types";

type CharacterFieldKey = keyof Pick<
  CharacterItem,
  "name" | "role" | "faction" | "status" | "motivations" | "description"
>;

const CHARACTER_FIELDS: Array<{
  label: string;
  key: CharacterFieldKey;
  multiline?: boolean;
}> = [
  { label: "Name", key: "name" },
  { label: "Role", key: "role" },
  { label: "Faction", key: "faction" },
  { label: "Status", key: "status" },
  { label: "Motivations", key: "motivations", multiline: true },
  { label: "Description", key: "description", multiline: true },
];

export default function CharacterViewPage() {
  const params = useParams();
  const characterId = params.characterId as string | undefined;
  const { item, loading } = useWorldItem(characterId);

  if (loading) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Loading character...
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Character not found.
      </PageContainer>
    );
  }

  const character = item as CharacterItem;

  return (
    <PageContainer className="space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-200/80">
          Character Profile
        </p>
        <h1 className="text-3xl font-semibold text-white">{character.name}</h1>
        <p className="text-sm text-white/65">
          Fields below are read-only. Switch to Author or Co-Author role to edit
          this profile.
        </p>
      </header>

      <GlassPanel title="Profile">
        <div className="space-y-6">
          {CHARACTER_FIELDS.map((field) => (
            <ReadonlyField
              key={field.key}
              label={field.label}
              value={character[field.key]}
              multiline={field.multiline}
            />
          ))}
        </div>
      </GlassPanel>
    </PageContainer>
  );
}

