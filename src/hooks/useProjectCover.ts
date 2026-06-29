import { useProject } from "./useProject";
import { getProjectCoverUrl } from "../services/projectService";

export function useProjectCover(projectId?: string) {
  const { project } = useProject(projectId ?? "");

  return {
    project,
    coverUrl: project?.cover_path
      ? getProjectCoverUrl(project.cover_path)
      : null,
  };
}