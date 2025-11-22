"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getWorldById,
  updateWorldMetadata,
  deleteWorld,
} from "@/lib/world-data";
import { WorldEntity } from "@/lib/types";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001/api";
const IMAGE_BASE_URL = `${API_BASE.replace("/api", "")}/uploads`;

export default function EditWorldPage() {
  const router = useRouter();
  const routeParams = useParams();
  const worldId = routeParams.worldId as string;

  const [worldData, setWorldData] = useState<WorldEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- State ---
  const [isPublic, setIsPublic] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!worldId) {
      setIsLoading(false);
      return;
    }

    getWorldById(worldId)
      .then((data) => {
        if (data) {
          setWorldData(data);

          // 🛠 FIX: Використовуємо 'as any', щоб прочитати властивості,
          // навіть якщо їх немає в офіційному інтерфейсі WorldEntity
          const rawData = data as any;

          console.log("🔍 Raw Backend Data:", rawData);
          console.log("🔍 Checking visibility:", {
            visibility: rawData.visibility,
            isPublic: rawData.isPublic,
          });

          // Логіка визначення публічності:
          // Пріоритет 1: visibility (бо в логах бекенду приходить саме воно)
          // Пріоритет 2: isPublic (якщо раптом структура зміниться)
          let isVisible = false;

          if (rawData.visibility !== undefined) {
            // Враховуємо boolean true або string "true"
            isVisible =
              rawData.visibility === true || rawData.visibility === "true";
          } else if (rawData.isPublic !== undefined) {
            isVisible =
              rawData.isPublic === true || rawData.isPublic === "true";
          }

          console.log("🔓 Final Calculated Visibility:", isVisible);
          setIsPublic(isVisible);

          // --- КАРТИНКА ---
          if (data.mapUrl) {
            const fullUrl = data.mapUrl.startsWith("http")
              ? data.mapUrl
              : `${IMAGE_BASE_URL}/${data.mapUrl}`;
            setPreviewUrl(fullUrl);
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [worldId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data: Partial<WorldEntity> = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as string,
      era: formData.get("era") as string,
      themes: formData.get("themes") as string,
      starting_region: formData.get("starting_region") as string,
      contributors: formData.get("contributors") as string,
      // Відправляємо isPublic, бо DTO бекенду (судячи з create) чекає саме isPublic,
      // який потім мапиться у visibility в базі
      isPublic: isPublic,
    };

    await updateWorldMetadata(worldId, data, imageFile);

    router.refresh();
    router.push(`/worlds/${worldId}`);
  };

  const handleDeleteWorld = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete world: ${worldData?.name}?`
      )
    ) {
      return;
    }
    await deleteWorld(worldId);
    router.refresh();
    router.push("/worlds");
  };

  if (isLoading) return <div className="p-10 text-white">Loading...</div>;
  if (!worldData)
    return <div className="p-10 text-white">World not found.</div>;

  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-3 text-left">
        <p className="font-display text-xs text-purple-200">WORLD FORGE</p>
        <h1 className="text-3xl font-semibold text-white">Edit Realm</h1>
      </header>

      <form
        className="grid gap-8 lg:grid-cols-[1.3fr_1fr]"
        onSubmit={handleSaveChanges}
      >
        <GlassPanel className="p-8">
          <div className="flex flex-col gap-8">
            {/* --- MAP SECTION --- */}
            <div>
              <p className="font-display text-xs text-purple-200/80">
                WORLD MAP
              </p>
              <div
                className="relative mt-4 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-purple-300/40 bg-black/10 p-10 text-center transition hover:bg-white/5 cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />

                {previewUrl ? (
                  <div className="relative h-64 w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Map Preview"
                      className="h-full w-full object-cover rounded-2xl shadow-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100 rounded-2xl">
                      <p className="text-xs uppercase tracking-widest text-white font-bold">
                        Change Image
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 h-32 w-full rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_65%_15%,rgba(192,132,252,0.35),transparent_55%),radial-gradient(circle_at_30%_80%,rgba(244,114,182,0.25),transparent_60%)]" />
                    <p className="text-sm text-white/60">
                      Drop an image or{" "}
                      <span className="text-purple-200 underline decoration-dashed underline-offset-4">
                        browse your archives
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Type
                </label>
                <Input
                  className="mt-2"
                  name="type"
                  defaultValue={worldData.type}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Era
                </label>
                <Input
                  className="mt-2"
                  name="era"
                  defaultValue={worldData.era}
                />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Themes
                </label>
                <Input
                  className="mt-2"
                  name="themes"
                  defaultValue={worldData.themes}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Starting Region
                </label>
                <Input
                  className="mt-2"
                  name="starting_region"
                  defaultValue={worldData.starting_region}
                />
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-8">
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Name
              </label>
              <Input
                className="mt-2"
                name="name"
                defaultValue={worldData.name}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Description
              </label>
              <Textarea
                className="mt-2"
                name="description"
                defaultValue={worldData.description}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Contributors
              </label>
              <Input
                className="mt-2"
                name="contributors"
                defaultValue={worldData.contributors}
              />
            </div>

            {/* --- VISIBILITY TOGGLE --- */}
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
                {/* Прихований інпут для гарантованої відправки */}
                <input
                  type="hidden"
                  name="is_public"
                  value={isPublic.toString()}
                />
              </div>

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
                Save Changes
              </Button>
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                onClick={handleDeleteWorld}
              >
                Delete World
              </Button>
            </div>
          </div>
        </GlassPanel>
      </form>
    </PageContainer>
  );
}
