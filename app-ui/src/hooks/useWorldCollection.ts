"use client";

import { useState, useEffect } from "react";
import { getMyWorlds, WorldEntity } from "@/lib/world-data";

export function useWorldCollection() {
  const [worlds, setWorlds] = useState<WorldEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMyWorlds()
      .then((data) => {
        setWorlds(data);
      })
      .catch((error) => {
        console.error("Failed to load world metadata:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { worlds, isLoading };
}
