import {
  ChevronDown,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAudio } from "../../context/AudioContext";
import { useProjectCover } from "../../hooks/useProjectCover";

function formatTime(seconds: number) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ExpandedPlayer() {
  const {
    expanded,
    closePlayer,

    currentSong,

    currentTime,
    duration,

    playing,

    playPause,
    previous,
    next,
    seek,
  } = useAudio();

const {
  project,
  coverUrl,
} = useProjectCover(currentSong?.project_id);
  if (!expanded || !currentSong) return null;

  const progress =
    duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30 }}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#08090D]"
    >
      {/* Blurred Background */}

      {coverUrl && (
        <img
          src={coverUrl}
          alt=""
          className="absolute inset-0 h-full w-full scale-125 object-cover blur-3xl opacity-30"
        />
      )}

      <div className="absolute inset-0 bg-[#08090D]/75 backdrop-blur-xl" />

      {/* Content */}

      <div className="relative z-10 flex h-full flex-col">

        {/* Close */}

        <button
          onClick={closePlayer}
          className="p-6"
        >
          <ChevronDown
            className="text-white"
            size={32}
          />
        </button>

        <div className="flex flex-1 flex-col items-center px-8">

          {/* Artwork */}

          <div className="mt-6 h-72 w-72 overflow-hidden rounded-3xl shadow-2xl">

            {coverUrl ? (
              <img
                src={coverUrl}
                alt={currentSong.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-500 to-cyan-400" />
            )}

          </div>

          {/* Song */}

          <h1 className="mt-10 text-center text-4xl font-black text-white">
            {currentSong.title}
          </h1>

          <p className="mt-2 text-lg text-zinc-400">
  {project?.name}
</p>


          {/* Progress */}

          <div className="mt-12 w-full max-w-xl">

            <div
              className="h-2 cursor-pointer overflow-hidden rounded-full bg-white/10"
              onClick={(e) => {
                const rect =
                  e.currentTarget.getBoundingClientRect();

                const percent =
                  (e.clientX - rect.left) /
                  rect.width;

                seek(duration * percent);
              }}
            >
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-sm text-zinc-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

          </div>

          {/* Controls */}

          <div className="mt-16 flex items-center gap-12">

            <button
              onClick={previous}
              className="text-white transition hover:scale-110"
            >
              <SkipBack size={34} />
            </button>

            <button
              onClick={playPause}
              className="rounded-full bg-blue-500 p-6 shadow-[0_0_35px_rgba(59,130,246,.45)]"
            >
              {playing ? (
                <Pause
                  size={40}
                  className="text-white"
                />
              ) : (
                <Play
                  size={40}
                  className="ml-1 text-white"
                />
              )}
            </button>

            <button
              onClick={next}
              className="text-white transition hover:scale-110"
            >
              <SkipForward size={34} />
            </button>

          </div>

        </div>

      </div>

    </motion.div>
  );
}