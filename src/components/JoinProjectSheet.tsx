import { AnimatePresence, motion } from "framer-motion";
import { useAudio } from "../context/AudioContext";

type Props = {
  open: boolean;
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onJoin: () => void;
};

export default function JoinProjectSheet({
  open,
  value,
  loading,
  onChange,
  onClose,
  onJoin,
}: Props) {
  const { currentSong } = useAudio();

  return (
    <AnimatePresence>
      {open && (
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
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (info.offset.y > 140) {
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

            <h2 className="text-center text-2xl font-bold text-white">
              Join Project
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-center text-zinc-400">
              Enter the invite code from a bandmate to add their project to your workspace.
            </p>

            <input
              autoFocus
              value={value}
              onChange={(e) =>
                onChange(e.target.value.toUpperCase())
              }
              placeholder="Invite code"
              className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-xl font-bold tracking-[0.18em] text-white outline-none placeholder:text-zinc-500"
            />

            <div className="mt-8 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 rounded-2xl bg-white/5 py-4 text-white transition duration-200 hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                onClick={onJoin}
                disabled={!value.trim() || loading}
                className="flex-1 rounded-2xl bg-blue-500 py-4 font-semibold text-white transition duration-200 hover:scale-[1.02] hover:bg-blue-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Joining..." : "Join"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
