import { supabase } from "../lib/supabase";

export type Song = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  audio_url: string | null;
  cover_url: string | null;
  created_at: string;
};

export async function getSongs(projectId: string) {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Song[];
}

export async function uploadSong(
  projectId: string,
  file: File,
  title: string
) {
  const path = `${projectId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("songs")
    .upload(path, file);

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("songs")
    .insert({
      project_id: projectId,
      title,
      audio_url: path,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}