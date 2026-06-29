import {
  GripVertical,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAudio } from "../../context/AudioContext";
import {
  deleteSong,
  type Song,
} from "../../services/songService";

type Props = {
  song: Song;
  songs: Song[];
  index: number;
  onDeleted: () => Promise<void>;

  dragListeners?: any;
  dragAttributes?: any;
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

export default function SongCard({
  song,
  songs,
  index,
  onDeleted,
  dragListeners,
  dragAttributes,
}: Props) {
  const {
    playQueue,
    currentSong,
    playing,
  } = useAudio();

  async function handleDelete(
    e: React.MouseEvent
  ) {
    e.stopPropagation();

    if (
      !window.confirm(
        `Delete "${song.title}"?\n\nThis cannot be undone.`
      )
    )
      return;

    try {
      await deleteSong(song);
      await onDeleted();
    } catch (err) {
      console.error(err);
      alert("Failed to delete song.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
      }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() =>
        playQueue(songs, index)
      }
      className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/5 bg-[#141821] p-5 transition-colors hover:bg-[#1A202B]"
    >
      <div className="flex items-center gap-4">

        <button
  {...dragListeners}
  {...dragAttributes}
  className="cursor-grab touch-none text-zinc-500 active:cursor-grabbing"
>
  <GripVertical size={18} />
</button>

        <div>
          <h2 className="text-xl font-semibold text-white">
            {song.title}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {formatUploadDate(
              song.created_at
            )}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-5">

        <button
          onClick={handleDelete}
          className="text-zinc-500 transition hover:text-red-500"
        >
          <Trash2 size={20} />
        </button>

        <div className="text-2xl text-blue-400">
          {playing &&
          currentSong?.id === song.id
            ? "⏸"
            : "▶"}
        </div>

      </div>

    </motion.div>
  );
}