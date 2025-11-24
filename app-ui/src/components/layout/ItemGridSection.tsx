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
  imageBaseUrl?: string; // 🆕 Додали цей проп
}

export function ItemGridSection({
  id,
  title,
  items,
  canEdit = false,
  addNewText,
  imageBaseUrl, // 🆕 Деструктуризуємо його
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
            {/* 👇 ПОЧАТОК ЗМІН: Блок зображення */}
            <div className="relative h-20 w-full rounded-lg bg-gray-600/20">
              {item.imageUrl && imageBaseUrl ? (
                <img
                  src={`${imageBaseUrl}/${item.imageUrl}`}
                  alt={item.name}
                  className="h-full w-full rounded-lg object-cover"
                  onError={(e) => {
                    // Якщо помилка завантаження - ховаємо картинку, показуємо заглушку знизу
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove(
                      "hidden"
                    );
                  }}
                />
              ) : null}

              {/* Заглушка (відображається якщо немає картинки або сталася помилка) */}
              <div
                className={`${
                  item.imageUrl ? "hidden" : "flex"
                } h-full w-full items-center justify-center rounded-lg bg-gray-600/50 text-xs text-white/30`}
              >
                {/* Можна замінити текст на іконку для кращого вигляду */}
                [No Image]
              </div>
            </div>
            {/* 👆 КІНЕЦЬ ЗМІН */}

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
