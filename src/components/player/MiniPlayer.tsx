import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAudio } from "../../context/AudioContext";

function formatTime(seconds: number) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MiniPlayer() {
  const {
    currentSong,
    currentTime,
    duration,
    playing,
    playPause,
    previous,
    next,
    openPlayer,
  } = useAudio();

  if (!currentSong) return null;

  const progress =
    duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 120 }}
      animate={{ y: 0 }}
      exit={{ y: 120 }}
      onClick={openPlayer}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#11151D]/95 backdrop-blur-xl"
    >
      <div className="px-5 pt-4">

        <div className="flex items-center justify-between">

          <div>
            <h3 className="font-semibold text-white">
              {currentSong.title}
            </h3>

            <p className="text-sm text-zinc-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          <div className="flex items-center gap-3">

  <button
    onClick={async (e) => {
      e.stopPropagation();
      await previous();
    }}
    className="text-white transition hover:scale-110"
  >
    <SkipBack size={22} />
  </button>

  <button
    onClick={async (e) => {
      e.stopPropagation();
      await playPause();
    }}
    className="rounded-full bg-blue-500 p-3"
  >
    {playing ? (
      <Pause
        className="text-white"
        size={20}
      />
    ) : (
      <Play
        className="text-white"
        size={20}
      />
    )}
  </button>

  <button
    onClick={async (e) => {
      e.stopPropagation();
      await next();
    }}
    className="text-white transition hover:scale-110"
  >
    <SkipForward size={22} />
  </button>

</div>

        </div>

        <div className="mt-4 mb-3 h-1 overflow-hidden rounded-full bg-white/10">

          <motion.div
            animate={{
              width: `${progress}%`,
            }}
            className="h-full bg-blue-500"
          />

        </div>

      </div>
    </motion.div>
  );
}