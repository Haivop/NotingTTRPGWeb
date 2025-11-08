"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ReadonlyField } from "@/components/ui/ReadonlyField";
import { useWorldItem } from "@/hooks/useWorldItem";
import type { QuestItem } from "@/lib/types";

type QuestFieldKey = keyof Pick<
  QuestItem,
  "name" | "hook" | "status" | "reward" | "objective" | "description"
>;

const QUEST_FIELDS: Array<{
  label: string;
  key: QuestFieldKey;
  multiline?: boolean;
}> = [
  { label: "Quest Name", key: "name" },
  { label: "Hook", key: "hook" },
  { label: "Status", key: "status" },
  { label: "Reward", key: "reward" },
  { label: "Objective", key: "objective" },
  { label: "Description", key: "description", multiline: true },
];

export default function QuestViewPage() {
  const params = useParams();
  const questId = params.questId as string | undefined;
  const { item, loading } = useWorldItem(questId);

  if (loading) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Loading quest...
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Quest not found.
      </PageContainer>
    );
  }

  const quest = item as QuestItem;

  return (
    <PageContainer className="space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-200/80">
          Quest Dossier
        </p>
        <h1 className="text-3xl font-semibold text-white">{quest.name}</h1>
        <p className="text-sm text-white/65">
          This quest sheet is view-only for Guests. Switch roles to modify
          objectives or progress.
        </p>
      </header>

      <GlassPanel title="Details">
        <div className="space-y-6">
          {QUEST_FIELDS.map((field) => (
            <ReadonlyField
              key={field.key}
              label={field.label}
              value={quest[field.key]}
              multiline={field.multiline}
            />
          ))}
        </div>
      </GlassPanel>
    </PageContainer>
  );
}

