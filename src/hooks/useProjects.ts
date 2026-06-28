import { useEffect, useState } from "react";
import { createProject, getProjects } from "../services/projectService";
import type { Project } from "../services/projectService";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);

    try {
      const data = await getProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }

  async function addProject(name: string) {
    const project = await createProject(name);

    setProjects((prev) => [project, ...prev]);
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    loading,
    projects,
    addProject,
    refresh,
  };
}