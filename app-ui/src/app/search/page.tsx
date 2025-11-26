"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { GlassPanel } from "@/components/ui/GlassPanel";
import {
  searchArchives,
  SearchItemResult,
  SearchWorldResult,
} from "@/lib/search-api";

const FILTERS = [
  { label: "Skyships", value: "locations" },
  { label: "Chronicles", value: "quests" },
  { label: "Artifacts", value: "artifacts" },
  { label: "Factions", value: "factions" },
  { label: "Timelines", value: "timelines" },
];

function formatDate(value?: string) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "";
  }
}

function WorldResultCard({ world }: { world: SearchWorldResult }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-purple-200/40 hover:bg-white/10">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-[11px] uppercase tracking-[0.28em] text-purple-100">
          World
        </p>
        <span className="text-[11px] uppercase tracking-[0.26em] text-white/40">
          {formatDate(world.updatedAt)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{world.name}</h3>
          <p className="mt-1 text-sm text-white/65">
            {world.description?.slice(0, 160) ||
              "A realm awaiting its first chronicle."}
          </p>
        </div>
        <Link
          href={`/worlds/${world.id}`}
          className="shrink-0 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/80 transition hover:border-white/30 hover:text-white"
        >
          Open
        </Link>
      </div>
      {world.tags?.length ? (
        <div className="flex flex-wrap gap-2 text-xs text-white/60">
          {world.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.24em]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function ItemResultCard({ item }: { item: SearchItemResult }) {
  const chipLabel = item.type.toUpperCase();
  return (
    <article className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 transition hover:border-purple-200/40 hover:bg-white/10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-purple-200/40 bg-purple-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-purple-100">
            {chipLabel}
          </span>
          <p className="text-xs uppercase tracking-[0.22em] text-white/50">
            {item.worldName || "Unknown realm"}
          </p>
        </div>
        <span className="text-[11px] uppercase tracking-[0.24em] text-white/40">
          {formatDate(item.updatedAt)}
        </span>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">{item.name}</h3>
          <p className="mt-1 text-sm text-white/65">
            {item.snippet || "No excerpt available yet."}
          </p>
        </div>
        <Link
          href={`/worlds/${item.worldId}`}
          className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/75 transition hover:border-white/30 hover:text-white"
        >
          View
        </Link>
      </div>
    </article>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [worlds, setWorlds] = useState<SearchWorldResult[]>([]);
  const [items, setItems] = useState<SearchItemResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 380);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    searchArchives(debouncedQuery, activeFilter ?? undefined, controller.signal)
      .then((payload) => {
        setWorlds(payload.worlds);
        setItems(payload.items);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Search failed", err);
        setError("Не вдалося завантажити результати пошуку.");
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [debouncedQuery, activeFilter]);

  const totalResults = useMemo(
    () => worlds.length + items.length,
    [worlds.length, items.length],
  );

  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-3">
        <p className="font-display text-xs text-purple-200">ARCANE INDEX</p>
        <h1 className="text-3xl font-semibold text-white">Search the Archives</h1>
        <p className="max-w-2xl text-sm text-white/70">
          Seek worlds, characters, quests, and lore entries crafted by your fellow
          storytellers.
        </p>
      </header>

      <GlassPanel>
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by realm, author, or tag..."
            />
            <p className="mt-3 text-xs text-white/50">
              Start typing to search across public worlds and their lore entries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-white/65">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setActiveFilter(isActive ? null : filter.value)
                  }
                  className={[
                    "rounded-full border px-4 py-2 uppercase tracking-[0.3em] transition",
                    isActive
                      ? "border-purple-200/70 bg-purple-500/20 text-white"
                      : "border-white/15 bg-white/10 hover:border-white/40 hover:text-white",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            {isLoading
              ? "Searching the archives..."
              : totalResults > 0
                ? `Found ${totalResults} entr${totalResults === 1 ? "y" : "ies"} ${
                    activeFilter ? `matching ${activeFilter}` : ""
                  }.`
                : "Try keywords like “Skyport”, “Factions”, or a world name to see matches."}
          </div>
        </div>
      </GlassPanel>

      <GlassPanel
        title="ARCHIVE RESULTS"
        description="Worlds, characters, quests, artifacts, and more pulled from public realms."
      >
        {error ? (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        ) : null}

        {!isLoading && !error && totalResults === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-sm text-white/60">
            Nothing matched that query yet. Try widening your search or removing a filter.
          </div>
        ) : null}

        {!isLoading && worlds.length > 0 ? (
          <div className="space-y-3">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-100">
              Worlds
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {worlds.map((world) => (
                <WorldResultCard key={world.id} world={world} />
              ))}
            </div>
          </div>
        ) : null}

        {!isLoading && items.length > 0 ? (
          <div className="mt-8 space-y-3">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-100">
              Lore Entries
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <ItemResultCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : null}
      </GlassPanel>
    </PageContainer>
  );
}
