"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createNewWorld } from "@/lib/world-data";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function CreateWorldPage() {
  const router = useRouter();
  // Логіка для перемикання видимості (як приклад)
  const [isPublic, setIsPublic] = useState(false);

  // 🆕 Стан для файлу та прев'ю
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 🆕 Реф для прихованого інпуту
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🆕 Обробник вибору файлу
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Створюємо тимчасовий URL для показу картинки відразу
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCreateWorld = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 1. Збираємо дані
    const data = {
      name: (formData.get("name") as string) || "Unnamed Realm",
      description: (formData.get("description") as string) || "",
      type: (formData.get("type") as string) || "",
      era: (formData.get("era") as string) || "",
      themes: (formData.get("themes") as string) || "",
      starting_region: (formData.get("starting_region") as string) || "",
      contributors: (formData.get("contributors") as string) || "",

      isPublic: isPublic,
    };

    // 2. Створюємо світ
    const newWorldId = await createNewWorld(data, imageFile);

    console.log(data);

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
              <div
                className="relative mt-4 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-purple-300/40 bg-black/10 p-10 text-center transition hover:bg-white/5 cursor-pointer group"
                onClick={() => fileInputRef.current?.click()} // Клік по діву тригерить інпут
              >
                {/* Прихований інпут */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />

                {previewUrl ? (
                  // Якщо є прев'ю - показуємо його
                  <div className="relative h-64 w-full">
                    <img
                      src={previewUrl}
                      alt="Map Preview"
                      className="h-full w-full object-cover rounded-2xl shadow-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100 rounded-2xl">
                      <p className="text-xs uppercase tracking-widest text-white font-bold">
                        Change Image
                      </p>
                    </div>
                  </div>
                ) : (
                  // Якщо немає - показуємо заглушку
                  <>
                    <div className="mb-4 h-32 w-full rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_65%_15%,rgba(192,132,252,0.35),transparent_55%),radial-gradient(circle_at_30%_80%,rgba(244,114,182,0.25),transparent_60%)]" />
                    <p className="text-sm text-white/60">
                      Drop an image or{" "}
                      <span className="text-purple-200 underline decoration-dashed underline-offset-4">
                        browse your archives
                      </span>
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/35">
                      PNG • JPG • SVG • WEBP
                    </p>
                  </>
                )}
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

            <div
              className={`flex items-center justify-between rounded-3xl border p-4 transition-all duration-300 ${
                isPublic
                  ? "border-purple-500/30 bg-purple-500/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {isPublic ? "Public World" : "Private World"}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {isPublic
                    ? "Visible to everyone in the community."
                    : "Only invited collaborators can view."}
                </p>
                {/* Прихований інпут, якщо потрібно передавати дані стандартним способом форми (не обов'язково, бо ми будуємо JSON вручну, але корисно) */}
                <input
                  type="hidden"
                  name="is_public"
                  value={isPublic.toString()}
                />
              </div>

              {/* ВЛАСНИЙ SWITCH TOGGLE */}
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative h-8 w-14 rounded-full border border-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                  isPublic ? "bg-purple-500" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    isPublic ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
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
