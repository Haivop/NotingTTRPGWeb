// src/hooks/useWorldOwnership.ts (Виправлений код)
"use client";

import { useAuth } from "@/components/layout/AuthContext";
import { getWorldById } from "@/lib/world-data";
import { User, WorldEntity } from "@/lib/types";
import { useState, useEffect } from "react";

export function useWorldOwnership(worldId: string) {
  const { user, isLoggedIn } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [isLoadingOwner, setIsLoadingOwner] = useState(true); // ✅ Початковий стан: true

  useEffect(() => {
    let isMounted = true; // 1. ПЕРЕВІРКА ВИХОДУ/НЕПОВНОГО СТАНУ

    if (!worldId || !isLoggedIn || !user) {
      setIsOwner(false);
      setIsLoadingOwner(false);
      return;
    }

    // 2. ❌ ВИДАЛЯЄМО: setIsLoadingOwner(true);
    //    Це не потрібно, якщо це не другий/третій виклик.

    // 💡 Тимчасово встановлюємо Loading, якщо це не перше завантаження
    //    (Це допомагає уникнути попередження)
    if (!isLoadingOwner) {
      setIsLoadingOwner(true);
    }

    getWorldById(worldId)
      .then((worldData: WorldEntity | null) => {
        // 💡 Додамо тип для worldData
        if (!isMounted) return; // 🏆 ОСНОВНА ПЕРЕВІРКА

        const isMatch = worldData?.authorId === user.id;
        setIsOwner(isMatch);
      })
      .catch((error) => {
        console.error("Error fetching world data for ownership check:", error);
        if (isMounted) setIsOwner(false);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingOwner(false);
        }
      });

    // 3. ФУНКЦІЯ ОЧИЩЕННЯ
    return () => {
      isMounted = false;
    };
  }, [worldId, isLoggedIn, user?.id]);

  return { isOwner, isLoadingOwner };
}
