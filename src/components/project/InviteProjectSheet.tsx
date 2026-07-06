import { Check, Copy, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { useAudio } from "../../context/AudioContext";

type Props = {
  open: boolean;
  code: string;
  loading: boolean;
  onClose: () => void;
  onGenerate: () => void;
};

export default function InviteProjectSheet({
  open,
  code,
  loading,
  onClose,
  onGenerate,
}: Props) {
  const { currentSong } = useAudio();
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    if (!code) return;

    await navigator.clipboard.writeText(code);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1600);
  }

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
              Invite Collaborators
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-center text-zinc-400">
              Share this code with a bandmate. Once they join, they can edit this project too.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Invite code
              </p>

              <p className="mt-3 text-4xl font-black tracking-[0.22em] text-white">
                {code || "------"}
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={onGenerate}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/5 py-4 text-white transition hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw size={18} />
                {loading ? "Generating..." : "New Code"}
              </button>

              <button
                onClick={copyCode}
                disabled={!code}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-500 py-4 font-semibold text-white transition hover:scale-[1.02] hover:bg-blue-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? (
                  <Check size={18} />
                ) : (
                  <Copy size={18} />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
