import { motion, AnimatePresence } from "framer-motion";
import type { Song } from "../../services/songService";
import { useAudio } from "../../context/AudioContext";

type Props = {
  open: boolean;
  song: Song | null;

  onClose: () => void;

  onRename: () => void;
  onMove: () => void;
  onDelete: () => void;
  onExport: () => void;
};

export default function SongOptionsSheet({
  open,
  song,
  onClose,
  onRename,
  onMove,
  onDelete,
  onExport,
}: Props) {
  const { currentSong } = useAudio();
  return (
    <AnimatePresence>
      {open && song && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={0.2}
  onDragEnd={(_, info) => {
    if (info.offset.y > 180) {
      onClose();
    }
  }}
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  transition={{
    type: "spring",
    damping: 30,
  }}
  className={`fixed left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-[34px] border border-white/10 bg-[#141821] p-6 ${
    currentSong ? "bottom-20" : "bottom-0"
  }`}
>
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-zinc-600" />

            <h2 className="text-center text-xl font-bold text-white">
              {song.title}
            </h2>

            <div className="mt-8 space-y-3 px-2">

              <button
                onClick={onRename}
                className="w-full rounded-2xl bg-white/5 px-4 py-4 text-left text-lg text-white transition hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                Rename
              </button>

              <button
                onClick={onMove}
                className="w-full rounded-2xl bg-white/5 px-4 py-4 text-left text-lg text-white transition hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                Move to Project
              </button>

              <button
                onClick={onExport}
                className="w-full rounded-2xl bg-white/5 px-4 py-4 text-left text-lg text-white transition hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"

                >
  Download
</button>
              <button
                onClick={onDelete}
                className="w-full rounded-2xl bg-red-500/10 px-4 py-4 text-left text-lg text-red-400 transition hover:bg-red-500/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                Delete
              </button> 

              <button
                onClick={onClose}
                className="flex-1 px-4 py-4 text-white transition hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </button>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}