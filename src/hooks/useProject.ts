import { useEffect, useState } from "react";
import {
  getProject,
  type Project,
} from "../services/projectService";

export function useProject(id: string) {
  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function refresh() {
    if (!id) return;

    try {
      const data = await getProject(id);

      setProject(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    project,
    loading,
    refresh,
  };
}
