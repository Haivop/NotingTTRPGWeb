"use client";

import React, { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { saveNewItem } from "@/lib/world-data";
import { ItemFormData } from "@/lib/types";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const ITEM_TYPE = "factions";

export default function CreateFactionPage() {
  const router = useRouter();
  const params = useParams();
  const worldId = params.worldId as string;

  const factionName = "New Faction";

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setGalleryFiles((prev) => [...prev, ...newFiles]);
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prev) => [...prev, ...newUrls]);
    }
    e.target.value = "";
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    router.push(`/worlds/${worldId}`);
  };

  const handleSaveFaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data: ItemFormData = {
      name: (formData.get("name") as string) || factionName,
      description: formData.get("description") as string,
    };

    await saveNewItem(worldId, ITEM_TYPE, data, imageFile, galleryFiles);

    router.refresh();
    const newUrl = `/worlds/${worldId}`;
    router.push(newUrl);
  };

  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-3">
        <p className="font-display text-xs text-purple-200">FACTION PROFILE</p>
        <h1 className="text-3xl font-semibold text-white">
          Create {factionName}
        </h1>
      </header>

      <GlassPanel>
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <div
              className="relative h-64 w-full overflow-hidden rounded-3xl border border-white/15 bg-black/20 group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Cover Preview"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-[radial-gradient(circle_at_50%_0%,rgba(192,132,252,0.45),transparent_60%),radial-gradient(circle_at_50%_100%,rgba(244,114,182,0.3),transparent_65%)]" />
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs font-bold uppercase tracking-widest text-white">
                  {previewUrl ? "Change Image" : "Upload Image"}
                </span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              {previewUrl ? "Change Image" : "Upload Image"}
            </button>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              <div className="flex items-center justify-between">
                <p className="font-display text-[11px] text-purple-100/80">
                  Gallery
                </p>
                <span className="text-[10px] text-white/30">
                  {galleryFiles.length} items
                </span>
              </div>

              <p className="mt-2 mb-3">Add supporting artwork.</p>

              <div className="grid grid-cols-3 gap-2">
                {galleryPreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/20 group"
                  >
                    <img
                      src={src}
                      className="h-full w-full object-cover"
                      alt={`Gallery ${idx}`}
                    />

                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
                    >
                      <span>x</span>{" "}
                    </button>
                  </div>
                ))}

                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 transition hover:border-white/40 hover:bg-white/10">
                  <span className="text-2xl text-white/50">+</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={handleGallerySelect}
                  />
                </label>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSaveFaction}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Name
                </label>
                <Input
                  defaultValue={factionName}
                  className="mt-2"
                  name="name"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Description
              </label>
              <Textarea
                defaultValue="Elowyn tracks star currents with a living astrolabe. She hides a pact with the Tempest Choir to keep her crew safe."
                className="mt-2"
                name="description"
              />
            </div>

            <div className="flex flex-col gap-4 pt-3 sm:flex-row">
              <Button type="submit" className="flex-1">
                Create Faction
              </Button>
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
