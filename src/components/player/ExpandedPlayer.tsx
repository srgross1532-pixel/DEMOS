import {
  ChevronDown,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

import { useAudio } from "../../context/AudioContext";
import { useProjectCover } from "../../hooks/useProjectCover";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.45,
      ease: "easeOut",
    },
  }),
};

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
      initial={{
        y: "100%",
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      exit={{
        y: "100%",
        opacity: 0,
      }}
      transition={{
        type: "spring",
        damping: 30,
      }}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#08090D]"
    >
      {coverUrl && (
        <motion.img
          initial={{
            opacity: 0,
            scale: 1.2,
          }}
          animate={{
            opacity: 0.55,
            scale: 1.5,
          }}
          transition={{
            duration: 0.8,
          }}
          src={coverUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover blur-[90px] saturate-150"
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.7,
        }}
        className="absolute inset-0 bg-gradient-to-b from-black/35 via-[#08090D]/45 to-[#08090D]"
      />

      <div className="relative z-10 flex h-full flex-col">

        <motion.button
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.05}
          onClick={closePlayer}
          className="p-6"
        >
          <ChevronDown
            className="text-white"
            size={32}
          />
        </motion.button>

        <div className="flex flex-1 flex-col items-center px-8">

          <motion.div
            layoutId="album-art"
            variants={fadeUp}
            initial="hidden"
            animate={
              playing
                ? {
                    opacity: 1,
                    y: 0,
                    scale: [1, 1.03, 1.015, 1],
                  }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }
            }
            custom={0.12}
            transition={{
              opacity: {
                duration: 0.45,
                delay: 0.12,
              },
              y: {
                duration: 0.45,
                delay: 0.12,
              },
              scale: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="mt-6 h-72 w-72 overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,.45)]"
          >
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={currentSong.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-500 to-cyan-400" />
            )}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.2}
            className="mt-10 text-center text-5xl font-black tracking-tight text-white"
          >
            {currentSong.title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.28}
            className="mt-3 text-xl font-medium text-zinc-300"
          >
            {project?.name}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.36}
            className="mt-12 w-full max-w-xl"
          >
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
              <motion.div
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  ease: "linear",
                  duration: 0.1,
                }}
                className="h-full rounded-full bg-blue-500 shadow-[0_0_18px_rgba(59,130,246,.8)]"
              />
            </div>

            <div className="mt-2 flex justify-between text-sm text-zinc-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </motion.div>
           <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.48}
            className="mt-20 flex items-center gap-12"
          >
            <motion.button
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.1 }}
              onClick={previous}
              className="text-white"
            >
              <SkipBack size={34} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              animate={
                playing
                  ? {
                      scale: [1, 1.12, 1],
                    }
                  : {
                      scale: 1,
                    }
              }
              transition={{
                scale: {
                  duration: playing ? 0.22 : 0,
                },
              }}
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
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.1 }}
              onClick={next}
              className="text-white"
            >
              <SkipForward size={34} />
            </motion.button>
          </motion.div>

        </div>

      </div>

    </motion.div>
  );
}         
