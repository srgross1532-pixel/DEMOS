import { useRef } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import ProjectHeader from "../components/project/ProjectHeader";
import SongList from "../components/project/SongList";

import { useProject } from "../hooks/useProject";
import { useSongs } from "../hooks/useSongs";
import { supabase } from "../lib/supabase";

import {
  uploadProjectCover,
} from "../services/projectService";

import { uploadSong } from "../services/songService";
import { formatSongTitle } from "../utils/formatSongTitle";

export default function ProjectPage() {
  const { id } = useParams();

  const {
    project,
    loading: projectLoading,
    refresh: refreshProject,
  } = useProject(id ?? "");

  const {
    songs,
    loading: songsLoading,
    refresh,
  } = useSongs(id ?? "");

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file || !id) return;

    const MAX_SIZE = 50 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      alert(
        "This file is larger than the current 50 MB upload limit.\n\n" +
          "For now, DEMOS supports audio files up to 50 MB."
      );

      e.target.value = "";
      return;
    }

    try {
      const title = formatSongTitle(file.name);

      await uploadSong(id, file, title);

      await refresh();

      e.target.value = "";
    } catch (err: any) {
      console.error(err);

      alert(
        err?.message ??
          JSON.stringify(err, null, 2) ??
          "Unknown upload error"
      );
    }
  }

  async function handleCoverSelected(file: File) {
   const {
  data: { session },
} = await supabase.auth.getSession();

console.log("SESSION:", session);
    console.log("Project ID:", id);
  if (!id) return;

  console.log("Uploading cover...");
  console.log(file);

  try {
    await uploadProjectCover(id, file);

    console.log("Upload finished");

    await refreshProject();

    console.log("Project refreshed");
  } catch (err) {
    console.error(err);
  }
}

  if (projectLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090D]">
        <p className="text-zinc-400">
          Loading project...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090D] pb-32">

      <ProjectHeader
        project={project}
        songCount={songs.length}
        onCoverSelected={handleCoverSelected}
      />

      <div className="px-6 pt-8">
        <SongList
          songs={songs}
          loading={songsLoading}
          onRefresh={refresh}
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".wav,.mp3,.m4a,.aac"
        hidden
        onChange={handleFileChange}
      />

      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => inputRef.current?.click()}
        className="fixed bottom-10 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_40px_rgba(59,130,246,.45)]"
      >
        <Plus
          className="text-white"
          size={30}
        />
      </motion.button>

    </main>
  );
}