"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { WorldItem } from "@/lib/types";

interface ItemGridSectionProps {
  id: string;
  title: string;
  items: WorldItem[];
  canEdit?: boolean;
  addNewText?: string;
}

export function ItemGridSection({
  id,
  title,
  items,
  canEdit = false,
  addNewText,
}: ItemGridSectionProps) {
  const router = useRouter();
  const params = useParams();
  const worldId = params.worldId as string;
  const itemType = id;

  const handleCreateNew = () => {
    if (!addNewText) return;
    router.push(`/worlds/${worldId}/${itemType}/create`);
  };

  const resolveItemHref = (itemId: string) => {
    if (!canEdit) {
      return `/worlds/${worldId}/${itemType}/${itemId}/view`;
    }
    return `/worlds/${worldId}/${itemType}/${itemId}/edit`;
  };

  return (
    <GlassPanel id={id} title={title}>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={resolveItemHref(item.id)}
            className={`flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center text-white/70 transition-colors ${
              canEdit
                ? "cursor-pointer hover:border-purple-400/50 hover:bg-purple-900/10"
                : "cursor-pointer hover:border-white/20"
            }`}
          >
            <div className="flex h-20 items-center justify-center rounded-lg bg-gray-600/50 text-xs">
              [Image Placeholder]
            </div>
            <p className="mt-2 font-display text-sm text-purple-100/90">
              {item.name}
            </p>
          </Link>
        ))}
        {addNewText && (
          <button
            type="button"
            onClick={handleCreateNew}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 p-4 text-white/50 transition hover:border-purple-400/50 hover:text-purple-400"
          >
            <span className="text-3xl font-light">+</span>
            <p className="mt-2 text-sm">{addNewText}</p>
          </button>
        )}
      </div>
    </GlassPanel>
  );
}
