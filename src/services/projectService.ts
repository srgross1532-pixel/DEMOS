import { supabase } from "../lib/supabase";

export type Project = {
  id: string;
  name: string;
  invite_code: string;
  cover_path: string | null;
  created_at: string;

  songs?: {
    count: number;
  }[];
};


export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(`
  *,
  songs(count)
`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Project[];
}

export async function createProject(name: string) {
  const invite = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      invite_code: invite,
    })
    .select()
    .single();

  if (error) throw error;

  return data as Project;
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Project;
}

export async function uploadProjectCover(
  projectId: string,
  file: File
) {
  const extension = file.name.split(".").pop();
  const path = `${projectId}/cover.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("project-covers")
    .upload(path, file, {
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { error } = await supabase
    .from("projects")
    .update({
      cover_path: path,
    })
    .eq("id", projectId);

  if (error) throw error;
}

export function getProjectCoverUrl(
  coverPath: string
) {
  const { data } = supabase.storage
    .from("project-covers")
    .getPublicUrl(coverPath);

  return data.publicUrl;
}

export async function deleteProject(
  project: Project
) {
  if (project.cover_path) {
    await supabase.storage
      .from("project-covers")
      .remove([project.cover_path]);
  }

  const { data: songs } = await supabase
    .from("songs")
    .select("audio_path")
    .eq("project_id", project.id);

  if (songs?.length) {
    const paths = songs
      .map((song) => song.audio_path)
      .filter(Boolean);

    if (paths.length) {
      await supabase.storage
        .from("songs")
        .remove(paths as string[]);
    }
  }

  await supabase
    .from("songs")
    .delete()
    .eq("project_id", project.id);
console.log("Deleting project:", project);

const { data: existing } = await supabase
  .from("projects")
  .select("*")
  .eq("id", project.id);

console.log("Existing project:", existing);

const { data, error } = await supabase
  .from("projects")
  .delete()
  .eq("id", project.id)
  .select();

console.log("DELETE DATA:", data);
console.log("DELETE ERROR:", error);

if (error) throw error;
}