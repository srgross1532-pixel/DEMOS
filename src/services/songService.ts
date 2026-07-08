import { supabase } from "../lib/supabase";
import { v4 as uuid } from "uuid";
async function getAudioDuration(
  file: File
): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio =
      document.createElement("audio");

    audio.preload = "metadata";

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);

      resolve(
        Math.round(audio.duration)
      );
    };

    audio.onerror = () => {
      reject(
        new Error(
          "Couldn't read audio duration."
        )
      );
    };

    audio.src =
      URL.createObjectURL(file);
  });
}

export type Song = {
  id: string;
  project_id: string;
  title: string;
  notes: string;
  audio_path: string | null;
  cover_url: string | null;
  order_index: number;
  created_at: string;
  duration_seconds: number | null;
  uploaded_by: string | null;

uploader?: {
  username: string;
} | null;
};

export async function getSongs(projectId: string) {
  const { data: songs, error } = await supabase
    .from("songs")
    .select("*")
    .eq("project_id", projectId)
    .order("order_index", {
      ascending: true,
    });

  if (error) throw error;

  const uploaderIds = [
    ...new Set(
      (songs ?? [])
        .map((song) => song.uploaded_by)
        .filter(Boolean)
    ),
  ];

  const { data: profiles } =
    uploaderIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, username")
          .in("id", uploaderIds)
      : { data: [] };

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [
      profile.id,
      profile.username,
    ])
  );

  return (songs ?? []).map((song) => ({
    ...song,
    uploader: song.uploaded_by
      ? {
          username:
            profileMap.get(song.uploaded_by) ??
            "Unknown",
        }
      : null,
  })) as Song[];
}

export async function uploadSong(
  projectId: string,
  file: File,
  title: string
) {
  const extension = file.name.split(".").pop();
  const fileName = `${uuid()}.${extension}`;  
  const path = `${projectId}/${fileName}`;
const duration =
  await getAudioDuration(file);
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  throw new Error("Not signed in.");
}
  const { error: uploadError } = await supabase.storage
    .from("songs")
    .upload(path, file);

  if (uploadError) throw uploadError;

  const { data: existingSongs, error: existingError } =
  await supabase
    .from("songs")
    .select("id, order_index")
    .eq("project_id", projectId);

if (existingError) throw existingError;

for (const song of existingSongs ?? []) {
  const { error } = await supabase
    .from("songs")
    .update({
      order_index: song.order_index + 1,
    })
    .eq("id", song.id);

  if (error) throw error;
}

  const { data, error } = await supabase
    .from("songs")
    .insert({
      project_id: projectId,
      title,
      audio_path: path,
      order_index: 0,
      duration_seconds: duration,
      uploaded_by: user.id,
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
export async function renameSong(
  songId: string,
  title: string
) {
  const { error } = await supabase
    .from("songs")
    .update({
      title,
    })
    .eq("id", songId);

  if (error) throw error;
}
export async function moveSong(
  songId: string,
  projectId: string
) {
  const { error } = await supabase
    .from("songs")
    .update({
      project_id: projectId,
    })
    .eq("id", songId);

  if (error) throw error;
}
export async function exportSong(
  song: Song
) {
  if (!song.audio_path) {
    throw new Error("Song has no audio file.");
  }
  const { data, error } = await supabase.storage
    .from("songs")
    .createSignedUrl(
      song.audio_path,
      60
    );

if (error) {
  console.error(error);
  throw error;
}

  window.open(data.signedUrl, "_blank");
}