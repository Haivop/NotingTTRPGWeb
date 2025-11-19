// src/hooks/useWorldOwnership.ts (Виправлений код)
"use client";

import { useAuth } from "@/components/layout/AuthContext";
import { getWorldById } from "@/lib/world-data";
import { WorldEntity } from "@/lib/types";
import { useState, useEffect } from "react";

export function useWorldOwnership(worldId: string) {
  const { user, isLoggedIn } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [isLoadingOwner, setIsLoadingOwner] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!worldId || !isLoggedIn || !user) {
      setIsOwner(false);
      setIsLoadingOwner(false);
      return;
    }

    setIsLoadingOwner(true);
    getWorldById(worldId)
      .then((worldData: WorldEntity | null) => {
        if (!isMounted) return;

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

    return () => {
      isMounted = false;
    };
  }, [worldId, isLoggedIn, user]);

  return { isOwner, isLoadingOwner };
}
