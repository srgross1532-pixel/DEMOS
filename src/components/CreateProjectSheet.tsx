import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
};

export default function CreateProjectSheet({
  open,
  value,
  onChange,
  onClose,
  onCreate,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute bottom-0 left-0 right-0 rounded-t-[36px] bg-[#141821] p-8"
          >
            <div className="mx-auto mb-6 h-1.5 w-14 rounded-full bg-zinc-600" />

            <h2 className="text-3xl font-bold text-white">
              New Project
            </h2>

            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Project name"
              className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-lg text-white outline-none"
            />

            <div className="mt-8 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border border-white/10 py-4 text-white"
              >
                Cancel
              </button>

              <button
                onClick={onCreate}
                className="flex-1 rounded-2xl bg-blue-500 py-4 font-semibold text-white"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}