"use client";

import { useEffect, useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { TwoColumnLayout } from "@/components/layout/TwoColumnLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ItemGridSection } from "@/components/layout/ItemGridSection";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/components/layout/AuthContext";
import { ExportMenu } from "@/components/layout/ExportMenu";
import {
  deleteWorld,
  getItemsByType,
  getWorldById,
  getMapPins,
  WorldEntity,
  deleteMapPin,
  createMapPin,
} from "@/lib/world-data";
import { WorldItem } from "@/lib/types";
import { useRouter, useParams } from "next/navigation";
import { InteractiveMap } from "@/components/layout/InteractiveMap";

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
  const [mapPins, setMapPins] = useState<any[]>([]);

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

  const allItemsFlat = useMemo(() => {
    return Object.values(collections).flat();
  }, [collections]);

  useEffect(() => {
    if (!worldId) return;
    let cancelled = false;

    const fetchData = async () => {
      try {
        // 1. Завантажуємо колекції
        const results = await Promise.all(
          ITEM_SECTION_CONFIG.map((section) =>
            getItemsByType(worldId, section.key)
          )
        );

        // 2. Завантажуємо піни
        const pinsData = await getMapPins(worldId);

        if (cancelled) return;

        const next: Record<string, WorldItem[]> = {};
        ITEM_SECTION_CONFIG.forEach((section, index) => {
          next[section.key] = results[index];
        });

        setCollections(next);
        setMapPins(pinsData); // Зберігаємо піни
      } catch (err) {
        console.error("Failed to load world data", err);
      }
    };

    fetchData();
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

  console.log("--- DEBUG: MAP DATA READY ---");
  console.log(`Map URL: ${world?.mapUrl ? "Loaded" : "Missing"}`);
  console.log(`Total Pins Fetched: ${mapPins.length}`);
  if (mapPins.length > 0) {
    console.log("First Pin Coords (x, y):", mapPins[0].x, mapPins[0].y);
    console.log("First Pin Item Name:", mapPins[0].linkedItem?.name);
  }
  console.log("Can Edit:", permissions.canManage);
  console.log("-------------------------------");

  const getSectionCount = (key: string) => {
    if (key === "maps") return world?.mapUrl ? 1 : 0;
    return collections[key]?.length ?? 0;
  };

  const handleSavePin = async (pinData: {
    x: number;
    y: number;
    itemId: string;
  }) => {
    try {
      const newPin = await createMapPin(worldId, pinData);
      setMapPins((prev) => [...prev, newPin]); // Оновлюємо UI
    } catch (e) {
      console.error("Failed to create pin", e);
      alert("Error creating pin");
    }
  };

  const handleDeletePin = async (pinId: string) => {
    if (!window.confirm("Remove this pin?")) return;
    try {
      await deleteMapPin(pinId);
      setMapPins((prev) => prev.filter((p) => p.id !== pinId)); // Оновлюємо UI
    } catch (e) {
      console.error("Failed to delete pin", e);
    }
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
          {world && collections && (
            <ExportMenu world={world} collections={collections} />
          )}
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
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            {world?.mapUrl ? (
              <InteractiveMap
                mapUrl={`${IMAGE_BASE_URL}/${world.mapUrl}`}
                initialPins={mapPins}
                availableItems={allItemsFlat}
                isEditable={permissions.canManage}
                worldId={worldId}
                onSavePin={handleSavePin}
                onDeletePin={handleDeletePin}
              />
            ) : (
              <div className="h-72 flex items-center justify-center rounded-3xl border border-white/15 bg-black/30 text-white/50">
                Map not uploaded yet.
              </div>
            )}

            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-white/45 text-center">
              {permissions.canManage
                ? "Click map to add pin • Hover to view details"
                : "Hover pins to view details"}
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
