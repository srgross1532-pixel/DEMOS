import {
  GripVertical,
  MoreVertical,
  Pause,
  Play,
} from "lucide-react";
import { motion } from "framer-motion";
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";

import { useAudio } from "../../context/AudioContext";
import type { Song } from "../../services/songService";

type Props = {
  song: Song;
  songs: Song[];
  index: number;
  onOpenOptions: (song: Song) => void;

  dragListeners?: DraggableSyntheticListeners;
  dragAttributes?: DraggableAttributes;
};

function formatUploadDate(date: string) {
  const uploaded = new Date(date);
  const now = new Date();

  const diff = Math.floor(
    (now.getTime() - uploaded.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "Uploaded today";
  if (diff === 1) return "Uploaded yesterday";
  if (diff < 7)
    return `Uploaded ${diff} days ago`;

  return `Uploaded ${uploaded.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year:
        uploaded.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined,
    }
  )}`;
}

function formatDuration(
  seconds: number | null
) {
  if (!seconds) return "--:--";

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export default function SongCard({
  song,
  songs,
  index,
  onOpenOptions,
  dragListeners,
  dragAttributes,
}: Props)
{
  const {
    playQueue,
    currentSong,
    playing,
  } = useAudio();
const isCurrentSong =
  currentSong?.id === song.id;


  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
      }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
className={`flex min-h-24 items-center justify-between rounded-lg border p-4 transition-all duration-300 hover:bg-[#1A202B] sm:p-5 ${
  isCurrentSong
    ? "border-blue-400/40 bg-[#182232] shadow-[0_0_20px_rgba(59,130,246,.18)]"
    : "border-white/10 bg-[#141821]"
}`}    >
      <div
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-4"
        onClick={() => playQueue(songs, index)}
      >
        <button
          {...dragListeners}
          {...dragAttributes}
          className="cursor-grab touch-none rounded-md p-1 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300 active:cursor-grabbing"
          aria-label={`Reorder ${song.title}`}
        >
          <GripVertical size={18} />
        </button>

        <div className="min-w-0">
<h2
  className={`truncate text-lg font-semibold transition-colors sm:text-xl ${
    isCurrentSong
      ? "text-blue-400"
      : "text-white"
  }`}
>            {song.title}
          </h2>

       <p className="mt-1 text-sm text-zinc-500">
  {song.uploader?.username && (
    <>
      <span className="font-medium text-blue-400">
        {song.uploader.username}
      </span>
      {" • "}
    </>
  )}

  {song.duration_seconds ? (
    <>
      {formatDuration(song.duration_seconds)}
      {" • "}
    </>
  ) : null}

  {formatUploadDate(song.created_at)}
</p>
        </div>

      </div>

      <div className="flex items-center gap-5">

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenOptions(song);
          }}
          className="rounded-full p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
          aria-label={`More options for ${song.title}`}
        >
          <MoreVertical size={20} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playQueue(songs, index);
          }}
className={`flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:scale-105 ${
  isCurrentSong
    ? "bg-blue-500 shadow-[0_0_28px_rgba(59,130,246,.55)]"
    : "bg-blue-500 shadow-[0_0_24px_rgba(59,130,246,.35)]"
}`}          aria-label={
            playing && currentSong?.id === song.id
              ? `Pause ${song.title}`
              : `Play ${song.title}`
          }
        >
          {playing && currentSong?.id === song.id ? (
            <Pause size={18} />
          ) : (
            <Play size={18} className="ml-0.5" />
          )}
        </button>

      </div>

    </motion.div>
  );
}
