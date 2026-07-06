import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../../services/projectService";
import { Music2 } from "lucide-react";
import { getProjectCoverUrl } from "../../services/projectService";
import { useAudio } from "../../context/AudioContext";
type Props = {
  open: boolean;
  songTitle: string;
  projects: Project[];

  onClose: () => void;
  onSelect: (project: Project) => void;
};

export default function MoveSongSheet({
  open,
  songTitle,
  projects,
  onClose,
  onSelect,
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
  onDragEnd={(_, info) => {
    if (info.offset.y > 120) {
      onClose();
    }
  }}
className={`fixed left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-[34px] border border-white/10 bg-[#141821] p-6 ${
  currentSong ? "bottom-20" : "bottom-0"
}`}  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  transition={{
    type: "spring",
    stiffness: 350,
    damping: 30,
  }}
>
 <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-zinc-600" /> 

            <h2 className="text-center text-2xl font-bold text-white">
                Move Song 
            </h2>
            <p className="mt-2 text-center text-zinc-400">
            {songTitle}
            </p>
            <div className="mt-8 space-y-3">

            {projects.map((project) => {
  const coverUrl = project.cover_path
    ? getProjectCoverUrl(project.cover_path)
    : null;

  return (
    <button
      key={project.id}
      onClick={() => onSelect(project)}
      className="flex w-full items-center gap-4 rounded-2xl bg-white/5 p-4 text-left transition hover:bg-white/10"
    >
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={project.name}
          className="h-14 w-14 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700">
          <Music2
            size={22}
            className="text-white"
          />
        </div>
      )}

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white">
          {project.name}
        </h3>

        <p className="text-sm text-zinc-400">
          {project.songs?.[0]?.count ?? 0} songs
        </p>
      </div>
    </button>
  );
})}

              <button
                onClick={onClose}
                className="w-full px-6 py-4 text-left text-lg text-zinc-400 transition hover:bg-white/10 hover:text-white"
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