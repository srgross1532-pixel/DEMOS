import { useEffect, useState } from "react";
import { getSongs } from "../services/songService";
import type { Song } from "../services/songService";

export function useSongs(projectId: string) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSongs(projectId);
setSongs(data ?? []);
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      load();
    }
  }, [projectId]);

  return {
    songs,
    loading,
  };
}