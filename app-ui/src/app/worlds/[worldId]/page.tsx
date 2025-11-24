"use client";

import { useEffect, useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { TwoColumnLayout } from "@/components/layout/TwoColumnLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ItemGridSection } from "@/components/layout/ItemGridSection"; // Переконайся, що шлях правильний
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/components/layout/AuthContext";
import {
  deleteWorld,
  getItemsByType,
  getWorldById,
  WorldEntity,
} from "@/lib/world-data";
import { WorldItem } from "@/lib/types";
import { useRouter, useParams } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001/api";
const IMAGE_BASE_URL = `${API_BASE.replace(/\/api\/?$/, "")}/uploads`;

const ITEM_SECTION_CONFIG = [
  {
    key: "continents",
    title: "CONTINENTS",
    navLabel: "Continents",
    addLabel: "Continent",
  },
  {
    key: "characters",
    title: "CHARACTERS",
    navLabel: "Characters",
    addLabel: "Character",
  },
  {
    key: "quests",
    title: "QUEST THREADS",
    navLabel: "Quests",
    addLabel: "Quest",
  },
  { key: "regions", title: "REGIONS", navLabel: "Regions", addLabel: "Region" },
  {
    key: "locations",
    title: "LOCATIONS",
    navLabel: "Locations",
    addLabel: "Location",
  },
  {
    key: "factions",
    title: "FACTIONS",
    navLabel: "Factions",
    addLabel: "Faction",
  },
  {
    key: "artifacts",
    title: "ARTIFACTS",
    navLabel: "Artifacts",
    addLabel: "Artifact",
  },
  {
    key: "timelines",
    title: "TIMELINES",
    navLabel: "Timelines",
    addLabel: "Timeline entry",
  },
];

const NAV_SECTIONS = [
  { key: "maps", label: "Maps" },
  ...ITEM_SECTION_CONFIG.map((section) => ({
    key: section.key,
    label: section.navLabel || section.title,
  })),
];

export default function WorldOverviewPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const params = useParams();
  const worldId = (params?.worldId as string) ?? "";

  const [world, setWorld] = useState<WorldEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collections, setCollections] = useState<Record<string, WorldItem[]>>(
    {}
  );
  const [itemsError, setItemsError] = useState<string | null>(null);

  useEffect(() => {
    if (!worldId) return;
    setIsLoading(true);
    getWorldById(worldId)
      .then((data) => {
        setWorld(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load world data", err);
        setError("Unable to load world details.");
      })
      .finally(() => setIsLoading(false));
  }, [worldId]);

  useEffect(() => {
    if (!worldId) return;
    let cancelled = false;

    const fetchCollections = async () => {
      try {
        const results = await Promise.all(
          ITEM_SECTION_CONFIG.map((section) =>
            getItemsByType(worldId, section.key)
          )
        );
        if (cancelled) return;
        const next: Record<string, WorldItem[]> = {};
        ITEM_SECTION_CONFIG.forEach((section, index) => {
          next[section.key] = results[index];
        });
        setCollections(next);
        setItemsError(null);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load world items", err);
        setItemsError("Unable to load world entries.");
      }
    };

    fetchCollections();
    return () => {
      cancelled = true;
    };
  }, [worldId]);

  const permissions = useMemo(() => {
    if (!user || !world) {
      return {
        isOwner: false,
        isCoAuthor: false,
        canManage: false,
        canDelete: false,
      };
    }
    const isOwner = world.authorId === user.id;
    const isCoAuthor = world.coAuthorIds?.includes(user.id) ?? false;
    return {
      isOwner,
      isCoAuthor,
      canManage: isOwner || isCoAuthor,
      canDelete: isOwner,
    };
  }, [user, world]);

  const handleDeleteWorld = async () => {
    if (!permissions.canDelete) return;
    if (!window.confirm("Delete this world permanently?")) return;
    await deleteWorld(worldId);
    router.push("/hub");
  };

  const worldName = world?.name ?? "Loading...";
  const coAuthorDisplay =
    world?.coAuthorIds && world.coAuthorIds.length > 0
      ? world.coAuthorIds
      : ["No collaborators yet"];

  if (isLoading && !world) {
    return (
      <PageContainer className="py-20 text-center text-white/70">
        Loading world data...
      </PageContainer>
    );
  }

  const getSectionCount = (key: string) => {
    if (key === "maps") return world?.mapUrl ? 1 : 0;
    return collections[key]?.length ?? 0;
  };

  return (
    <div className="space-y-10">
      <PageContainer>
        {/* ... (Header без змін) ... */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <p className="font-display text-l text-purple-200/80">
              WORLD OVERVIEW
            </p>
            <h1 className="text-3xl font-semibold text-white">{worldName}</h1>
            <p className="max-w-3xl text-sm text-white/70">
              {world?.description ||
                "Suspended between the heavens and the abyss..."}
            </p>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
          {permissions.canDelete && (
            <button
              onClick={handleDeleteWorld}
              className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/40"
            >
              Delete World
            </button>
          )}
        </header>
      </PageContainer>

      <TwoColumnLayout
        sidebar={
          <div className="space-y-6">
            <Input placeholder="Search the codex..." />
            <nav className="space-y-2 text-sm text-white/65">
              {NAV_SECTIONS.map((section) => (
                <a
                  key={section.key}
                  href={`#${section.key}`}
                  className="flex items-center justify-between rounded-2xl px-3 py-2 transition hover:bg-white/5 hover:text-white"
                >
                  <span>{section.label}</span>
                  <span className="text-xs text-white/30">
                    {getSectionCount(section.key)}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        }
      >
        <GlassPanel id="maps" title="SKYMAP">
          <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_60%_20%,rgba(192,132,252,0.35),transparent_55%),radial-gradient(circle_at_20%_80%,rgba(244,114,182,0.25),transparent_60%)] p-10">
            {world?.mapUrl ? (
              <div className="overflow-hidden rounded-3xl border border-white/15 bg-black/30">
                <img
                  src={`${IMAGE_BASE_URL}/${world.mapUrl}`}
                  alt={`${worldName} Map`}
                  className="h-auto w-full object-cover min-h-[300px]"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="h-72 rounded-3xl border border-white/15 bg-black/30" />
            )}
            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-white/45">
              Drag to pan • Scroll to zoom
            </p>
          </div>
        </GlassPanel>

        {ITEM_SECTION_CONFIG.map((section) => (
          <ItemGridSection
            key={section.key}
            id={section.key}
            title={section.title}
            items={collections[section.key] ?? []}
            canEdit={permissions.canManage}
            addNewText={
              permissions.canManage ? `+ New ${section.addLabel}` : undefined
            }
            imageBaseUrl={IMAGE_BASE_URL}
          />
        ))}
      </TwoColumnLayout>
    </div>
  );
}
