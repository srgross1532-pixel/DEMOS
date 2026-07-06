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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return {
    songs,
    loading,
    refresh,
  };
}
