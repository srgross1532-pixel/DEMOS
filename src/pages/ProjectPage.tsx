import { useRef } from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import ConfirmSheet from "../components/ConfirmSheet";
import RenameSheet from "../components/RenameSheet";
import ProjectHeader from "../components/project/ProjectHeader";
import InviteProjectSheet from "../components/project/InviteProjectSheet";
import SongList from "../components/project/SongList";
import SongOptionsSheet from "../components/project/SongOptionsSheet";
import MoveSongSheet from "../components/project/MoveSongSheet";
import { useAudio } from "../context/AudioContext";
import { useProject } from "../hooks/useProject";
import { useSongs } from "../hooks/useSongs";
import { useProjects } from "../hooks/useProjects";
import {
  generateProjectInviteCode,
  uploadProjectCover,
} from "../services/projectService";
import {
  uploadSong,
  renameSong,
  deleteSong,
  moveSong,
  type Song,
} from "../services/songService";
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
  const { projects } = useProjects();
  const inputRef = useRef<HTMLInputElement>(null);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [selectedSong, setSelectedSong] =
    useState<Song | null>(null);
  const [renameOpen, setRenameOpen] =
    useState(false);
  const [confirmOpen, setConfirmOpen] =
    useState(false);
  const [renameValue, setRenameValue] =
    useState("");
  const [moveOpen, setMoveOpen] =
    useState(false);
  const [inviteOpen, setInviteOpen] =
    useState(false);
  const [inviteCode, setInviteCode] =
    useState("");
  const [inviteLoading, setInviteLoading] =
    useState(false);
  const { currentSong } = useAudio();

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
    } catch (err: unknown) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Unknown upload error"
      );
    }
  }

  async function handleCoverSelected(file: File) {
    if (!id) return;

    try {
      await uploadProjectCover(id, file);

      await refreshProject();
    } catch (err) {
      console.error(err);

      alert("Failed to update project artwork.");
    }
  }

  async function generateInvite() {
    if (!id) return;

    setInviteLoading(true);

    try {
      const code =
        await generateProjectInviteCode(id);

      setInviteCode(code);

      await refreshProject();
    } catch (err) {
      console.error(err);

      alert("Failed to generate invite code.");
    } finally {
      setInviteLoading(false);
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
        onInvite={() => {
          setInviteCode(project?.invite_code ?? "");
          setInviteOpen(true);
        }}
      />

      <div className="px-6 pt-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">
              TRACKS FOR REVIEW
            </p>

            
          </div>

         
        </div>

        <SongList
          songs={songs}
          loading={songsLoading}
          onRefresh={refresh}
          onOpenOptions={(song) => {
            setSelectedSong(song);
            setOptionsOpen(true);
          }}
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
        className={`fixed right-6 transition-all duration-300 ${
          currentSong ? "bottom-28" : "bottom-10"
        } flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,.45)]`}
        aria-label="Upload demo"
      >
        <Plus
          className="text-white"
          size={30}
        />
      </motion.button>

      <SongOptionsSheet
        open={optionsOpen}
        song={selectedSong}
        onClose={() => {
          setOptionsOpen(false);
          setSelectedSong(null);
        }}
        onRename={() => {
          if (!selectedSong) return;

          setRenameValue(selectedSong.title);

          setOptionsOpen(false);
          setRenameOpen(true);
        }}
        onMove={() => {
          setOptionsOpen(false);
          setMoveOpen(true);
        }}
        onDelete={() => {
          setOptionsOpen(false);
          setConfirmOpen(true);
        }}
      />

      <RenameSheet
        open={renameOpen}
        title="Rename Song"
        value={renameValue}
        onChange={setRenameValue}
        onClose={() => {
          setRenameOpen(false);
        }}
        onSave={async () => {
          if (!selectedSong) return;

          try {
            await renameSong(
              selectedSong.id,
              renameValue.trim()
            );

            await refresh();

            setRenameOpen(false);
            setSelectedSong(null);
          } catch (err) {
            console.error(err);
            alert("Failed to rename song.");
          }
        }}
      />

      <ConfirmSheet
        open={confirmOpen}
        title="Delete Song?"
        description="This action cannot be undone."
        confirmText="Delete"
        onClose={() => {
          setConfirmOpen(false);
        }}
        onConfirm={async () => {
          if (!selectedSong) return;

          try {
            await deleteSong(selectedSong);

            await refresh();

            setConfirmOpen(false);
            setSelectedSong(null);
          } catch (err) {
            console.error(err);

            alert("Failed to delete song.");
          }
        }}
      />

      <MoveSongSheet
        open={moveOpen}
        songTitle={selectedSong?.title ?? ""}
        projects={projects.filter(
          (project) => project.id !== id
        )}
        onClose={() => {
          setMoveOpen(false);
        }}
        onSelect={async (project) => {
          if (!selectedSong) return;

          try {
            await moveSong(
              selectedSong.id,
              project.id
            );

            await refresh();

            setMoveOpen(false);
            setSelectedSong(null);
          } catch (err) {
            console.error(err);

            alert("Failed to move song.");
          }
        }}
      />

      <InviteProjectSheet
        open={inviteOpen}
        code={inviteCode}
        loading={inviteLoading}
        onClose={() => {
          setInviteOpen(false);
        }}
        onGenerate={generateInvite}
      />
    </main>
  );
}
