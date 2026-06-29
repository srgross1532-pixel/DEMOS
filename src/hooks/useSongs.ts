import { useEffect, useState } from "react";
import { getSongs } from "../services/songService";
import type { Song } from "../services/songService";

export function useSongs(projectId: string) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    if (!projectId) return;

    setLoading(true);

    try {
      const data = await getSongs(projectId);
      setSongs(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [projectId]);

  return {
    songs,
    loading,
    refresh,
  };
}