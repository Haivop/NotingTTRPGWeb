"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ReadonlyField } from "@/components/ui/ReadonlyField";
import { useWorldItem } from "@/hooks/useWorldItem";
import type { QuestItem } from "@/lib/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001/api";
const IMAGE_BASE_URL = `${API_BASE.replace("/api", "")}/uploads`;

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

  const imageUrl = quest.imageUrl
    ? `${IMAGE_BASE_URL}/${quest.imageUrl}`
    : null;
  const galleryImages = quest.galleryImages || [];

  return (
    <PageContainer className="space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-200/80">
          Quest Dossier
        </p>
        <h1 className="text-3xl font-semibold text-white">{quest.name}</h1>
        <p className="text-sm text-white/65">
          This quest sheet is view-only unless the world owner grants you
          co-author access. Sign in to collaborate.
        </p>
      </header>

      <GlassPanel title="Visuals">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="md:w-1/2">
            {imageUrl ? (
              <div className="w-full rounded-2xl border border-white/10 bg-black/30 overflow-hidden shadow-lg">
                <img
                  src={imageUrl}
                  alt={`Cover image for ${quest.name}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center rounded-2xl border border-dashed border-white/10 text-white/50">
                No Cover Image
              </div>
            )}
          </div>

          <div className="md:w-1/2">
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {galleryImages.map((fileName, idx) => (
                  <div
                    key={idx}
                    className="aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/20"
                  >
                    <img
                      src={`${IMAGE_BASE_URL}/${fileName}`}
                      alt={`Gallery image ${idx}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-white/10 text-white/50 p-4">
                No supplemental gallery images.
              </div>
            )}
          </div>
        </div>
      </GlassPanel>

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
