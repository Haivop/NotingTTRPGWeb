"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createNewWorld } from "@/lib/world-data";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export default function CreateWorldPage() {
  const router = useRouter();
  // Логіка для перемикання видимості (як приклад)
  const [isPrivate, setIsPrivate] = useState(true);

  const handleCreateWorld = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 1. Збираємо дані
    const data = {
      name: (formData.get("name") as string) || "Unnamed Realm",
      description: (formData.get("description") as string) || "",

      // Поля з GlassPanel 1
      type: (formData.get("type") as string) || "",
      era: (formData.get("era") as string) || "",
      themes: (formData.get("themes") as string) || "",
      starting_region: (formData.get("starting_region") as string) || "",

      // Поля з GlassPanel 2
      contributors: (formData.get("contributors") as string) || "", // Збираємо лише одне поле
      visibility: !isPrivate, // true = Public, false = Private
    };

    // 2. Створюємо світ
    const newWorldId = await createNewWorld(data);

    // 3. Оновлення та перенаправлення
    router.refresh();
    router.push(`/worlds/${newWorldId}`); // Перенаправляємо на сторінку огляду щойно створеного світу
  };
  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-3 text-left">
        <p className="font-display text-xs text-purple-200">WORLD FORGE</p>
        <h1 className="text-3xl font-semibold text-white">Birth a New Realm</h1>
        <p className="max-w-2xl text-sm text-white/70">
          Sketch the first spark of your world. You can refine lore,
          collaborators, and permissions later—focus now on the beating heart of
          the setting.
        </p>
      </header>

      <form
        className="grid gap-8 lg:grid-cols-[1.3fr_1fr]"
        onSubmit={handleCreateWorld}
      >
        <GlassPanel className="p-8">
          <div className="flex flex-col gap-8">
            <div>
              <p className="font-display text-xs text-purple-200/80">
                WORLD MAP
              </p>
              <div className="mt-4 flex flex-col items-center justify-center rounded-3xl border border-dashed border-purple-300/40 bg-black/10 p-10 text-center">
                <div className="mb-4 h-32 w-full rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_65%_15%,rgba(192,132,252,0.35),transparent_55%),radial-gradient(circle_at_30%_80%,rgba(244,114,182,0.25),transparent_60%)]" />
                <p className="text-sm text-white/60">
                  Drop an image or{" "}
                  <span className="text-purple-200">browse your archives</span>
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/35">
                  PNG • JPG • SVG • WEBP
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Primary World Type
                </label>
                <Input
                  placeholder="E.g. High Fantasy | Cosmic Horror"
                  className="mt-2"
                  name="type"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Era
                </label>
                <Input
                  placeholder="Age of Dawning"
                  className="mt-2"
                  name="era"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Key Themes
                </label>
                <Input
                  placeholder="Skyships, Living Storms, Lost Gods"
                  className="mt-2"
                  name="themes"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Starting Region
                </label>
                <Input
                  placeholder="The Sapphire Archipelago"
                  className="mt-2"
                  name="starting_region"
                />
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-8">
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                World Name
              </label>
              <Input
                placeholder="Name your realm"
                className="mt-2"
                defaultValue="New World"
                name="name"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Description
                </label>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                  0 / 800
                </span>
              </div>
              <Textarea
                placeholder="Summon a legend about this world's origin, tone, and mysteries."
                className="mt-2"
                name="description"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Contributors
              </label>
              <div className="mt-2 flex gap-2">
                <Input placeholder="scribe@alliance.guild" className="flex-1" />
                <Button
                  type="button"
                  variant="ghost"
                  className="min-w-max px-5"
                >
                  Invite
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["elyra@skydock", "sable@shadowcourt"].map((person) => (
                  <span
                    key={person}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70"
                  >
                    {person}
                    <button
                      type="button"
                      className="rounded-full border border-white/20 px-2 text-[10px] uppercase tracking-[0.3em] text-white/50"
                    >
                      Remove
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Visibility
                </p>
                <p className="mt-1 text-sm text-white/70">
                  Private &mdash; Only invited collaborators can view.
                </p>
              </div>
              <Button type="button" variant="outline" className="min-w-[140px]">
                Toggle
              </Button>
            </div>

            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <Button type="submit" className="flex-1">
                Create World
              </Button>
              <Button type="button" variant="ghost" className="flex-1">
                Save Draft
              </Button>
            </div>
          </div>
        </GlassPanel>
      </form>
    </PageContainer>
  );
}
