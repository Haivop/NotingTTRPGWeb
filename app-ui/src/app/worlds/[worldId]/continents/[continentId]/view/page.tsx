"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ReadonlyField } from "@/components/ui/ReadonlyField";
import { useWorldItem } from "@/hooks/useWorldItem";
import type { ContinentItem } from "@/lib/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001/api";
const IMAGE_BASE_URL = `${API_BASE.replace("/api", "")}/uploads`;

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

  const imageUrl = continent.imageUrl
    ? `${IMAGE_BASE_URL}/${continent.imageUrl}`
    : null;
  const galleryImages = continent.galleryImages || [];

  return (
    <PageContainer className="space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-200/80">
          Continent Profile
        </p>
        <h1 className="text-3xl font-semibold text-white">{continent.name}</h1>
        <p className="text-sm text-white/65">
          Guests can browse immutable data for this continent. Editing is
          reserved for the owner and trusted co-authors.
        </p>
      </header>

      <GlassPanel title="Map & Visuals">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="md:w-1/2">
            {imageUrl ? (
              <div className="w-full rounded-2xl border border-white/10 bg-black/30 overflow-hidden shadow-lg">
                <img
                  src={imageUrl}
                  alt={`Cover image for ${continent.name}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center rounded-2xl border border-dashed border-white/10 text-white/50">
                No Map Image
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
