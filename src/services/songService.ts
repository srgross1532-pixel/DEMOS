import { supabase } from "../lib/supabase";

export type Song = {
  id: string;
  project_id: string;
  title: string;
  notes: string;
  audio_path: string | null;
  cover_url: string | null;
  order_index: number;
  created_at: string;
};

export async function getSongs(projectId: string) {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("project_id", projectId)
    .order("order_index", { ascending: true });

  if (error) throw error;

  return (data ?? []) as Song[];
}

export async function uploadSong(
  projectId: string,
  file: File,
  title: string
) {
  const extension = file.name.split(".").pop();
  const fileName = crypto.randomUUID() + "." + extension;
  const path = `${projectId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("songs")
    .upload(path, file);

  if (uploadError) throw uploadError;

  const { count } = await supabase
    .from("songs")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("project_id", projectId);

  const { data, error } = await supabase
    .from("songs")
    .insert({
      project_id: projectId,
      title,
      audio_path: path,
      order_index: count ?? 0,
    })
    .select()
    .single();

  if (error) throw error;

  return data as Song;
}

export async function deleteSong(song: Song) {
  if (song.audio_path) {
    const { error: storageError } = await supabase.storage
      .from("songs")
      .remove([song.audio_path]);

    if (storageError) throw storageError;
  }

  const { error } = await supabase
    .from("songs")
    .delete()
    .eq("id", song.id);

  if (error) throw error;
}

export async function updateSongOrder(
  songs: Song[]
) {
  for (let i = 0; i < songs.length; i++) {
    const { error } = await supabase
      .from("songs")
      .update({
        order_index: i,
      })
      .eq("id", songs[i].id);

    if (error) throw error;
  }
}

export async function getSongUrl(audioPath: string) {
  const { data, error } = await supabase.storage
    .from("songs")
    .createSignedUrl(audioPath, 60 * 60);

  if (error) throw error;

  return data.signedUrl;
}