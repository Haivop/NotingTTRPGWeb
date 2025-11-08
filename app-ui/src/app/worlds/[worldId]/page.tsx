"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { TwoColumnLayout } from "@/components/layout/TwoColumnLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ItemGridSection } from "@/components/layout/ItemGridSection";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/components/layout/AuthContext";
import { getItemsByType, WorldItem, deleteWorld } from "@/lib/world-data";
import { useRouter } from "next/navigation";

const sidebarSections = [
  "Maps",
  "Continents",
  "Regions",
  "Locations",
  "Factions",
  "Characters",
  "Quests",
  "Artifacts",
  "Timelines",
];

export default function WorldOverviewPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { role } = useAuth();
  const router = useRouter();
  const [worldData, setWorldData] = useState<Record<string, WorldItem[]>>({});
  const [worldName, setWorldName] = useState("");
  const [worldId, setWorldId] = useState("");

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      const name = resolvedParams.worldId
        ? resolvedParams.worldId
            .split("-")
            .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
            .join(" ")
        : "Unnamed Realm";
      setWorldName(name);
      setWorldId(resolvedParams.worldId);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!worldId) return;
    const fetchData = async () => {
      const [
        continents,
        regions,
        locations,
        factions,
        artifacts,
        timelines,
        quests,
        characters,
      ] = await Promise.all([
        getItemsByType(worldId, "continents"),
        getItemsByType(worldId, "regions"),
        getItemsByType(worldId, "locations"),
        getItemsByType(worldId, "factions"),
        getItemsByType(worldId, "artifacts"),
        getItemsByType(worldId, "timelines"),
        getItemsByType(worldId, "quests"),
        getItemsByType(worldId, "characters"),
      ]);
      setWorldData({
        continents,
        regions,
        locations,
        factions,
        artifacts,
        timelines,
        quests,
        characters,
      });
    };
    fetchData();
  }, [worldId, role]);

  const canCreate = role === "Author" || role === "Co-Author";
  const canEdit = role === "Author" || role === "Co-Author";
  const canDelete = role === "Author";

  console.log("WorldOverviewPage - Role:", role, "canDelete:", canDelete);

  const handleDeleteWorld = async () => {
    if (canDelete) {
      await deleteWorld(worldId);
      router.push("/hub");
    }
  };

  return (
    <div className="space-y-10">
      <PageContainer>
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <p className="font-display text-l text-purple-200/80">
              WORLD OVERVIEW
            </p>
            <h1 className="text-3xl font-semibold text-white">{worldName}</h1>
            <p className="max-w-3xl text-sm text-white/70">
              Suspended between the heavens and the abyss, the realm hums with
              skyward ley lines, song-bound storms, and guilds vying for dominion
              over floating citadels.
            </p>
          </div>
          {canDelete && (
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
              {sidebarSections.map((section) => (
                <a
                  key={section}
                  href={`#${section.toLowerCase()}`}
                  className="flex items-center justify-between rounded-2xl px-3 py-2 transition hover:bg-white/5 hover:text-white"
                >
                  <span>{section}</span>
                  <span className="text-xs text-white/30">12</span>
                </a>
              ))}
            </nav>

            <div className="rounded-3xl border border-purple-300/30 bg-purple-500/10 p-5 text-xs text-purple-100">
              <p className="font-display text-[11px] uppercase tracking-[0.3em]">
                Co-Authors
              </p>
              <ul className="mt-3 space-y-2 text-white/70">
                <li>@sable.stargazer</li>
                <li>@quinn.cartographer</li>
                <li>@leyline.mage</li>
              </ul>
            </div>
          </div>
        }
      >
        <GlassPanel id="maps" title="SKYMAP">
          <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_60%_20%,rgba(192,132,252,0.35),transparent_55%),radial-gradient(circle_at_20%_80%,rgba(244,114,182,0.25),transparent_60%)] p-10">
            <div className="h-72 rounded-3xl border border-white/15 bg-black/30" />
            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-white/45">
              Drag to pan • Scroll to zoom • Double-click for region detail
            </p>
          </div>
        </GlassPanel>
        <ItemGridSection
          id="continents"
          title="CONTINENTS"
          data={worldData.continents}
          addNewText={canCreate ? "+ New Continent" : undefined}
        />

        <ItemGridSection
          id="characters"
          title="CHARACTERS"
          data={worldData.characters}
          addNewText={canCreate ? "+ New Character" : undefined}
        />

        <ItemGridSection
          id="quests"
          title="QUEST THREADS"
          data={worldData.quests}
          addNewText={canCreate ? "+ New Quest" : undefined}
        />

        <ItemGridSection
          id="regions"
          title="REGIONS"
          data={worldData.regions}
          addNewText={canCreate ? "+ New Region" : undefined}
        />

        <ItemGridSection
          id="locations"
          title="LOCATIONS"
          data={worldData.locations}
          addNewText={canCreate ? "+ New Location" : undefined}
        />

        <ItemGridSection
          id="factions"
          title="FACTIONS"
          data={worldData.factions}
          addNewText={canCreate ? "+ New Faction" : undefined}
        />

        <ItemGridSection
          id="artifacts"
          title="ARTIFACTS"
          data={worldData.artifacts}
          addNewText={canCreate ? "+ New Artifact" : undefined}
        />

        <ItemGridSection
          id="timelines"
          title="TIMELINES"
          data={worldData.timelines}
          addNewText={canCreate ? "+ New Timeline" : undefined}
        />
      </TwoColumnLayout>
    </div>
  );
}
