import { motion } from "framer-motion";
import {
  Music2,
  Users,
  Trash2,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { getProjectCoverUrl } from "../../services/projectService";

type Props = {
  id: string;
  title: string;
  songs: number;
  members: number;
  updated: string;
  colors: string;
  index: number;
  onRename: () => void;
  coverPath: string | null;
  onDelete: () => void;
};

export default function ProjectCard({
  id,
  title,
  songs,
  members,
  updated,
  colors,
  index,
  coverPath,
  onDelete,
  onRename,
}: Props) {
  const navigate = useNavigate();

  const coverUrl = coverPath
    ? getProjectCoverUrl(coverPath)
    : null;

  return (
    <motion.div
      onClick={() => navigate(`/project/${id}`)}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.45,
      }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-[#13171F] shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">

        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${colors}`}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/70" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute right-4 top-4 rounded-full bg-black/35 p-2 text-zinc-300 backdrop-blur transition hover:bg-black/50 hover:text-red-400"
          aria-label={`Delete ${title}`}
        >
          <Trash2 size={16} />
        </button>

        <div className="absolute bottom-5 left-5">
          <div className="flex items-center gap-2">
            <h2 className="line-clamp-2 text-2xl font-bold text-white">
              {title}
            </h2>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRename();
              }}
              className="rounded-full bg-black/30 p-2 text-zinc-300 backdrop-blur transition hover:bg-black/50 hover:text-white"
              aria-label={`Rename ${title}`}
            >
              <Pencil size={16} />
            </button>

          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 p-5">
        <div className="flex flex-wrap gap-4 text-zinc-400">
          <div className="flex items-center gap-2">
            <Music2 size={18} />
            <span>
              {songs} demo{songs !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users size={18} />
            <span>
              {members} member{members !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-blue-300">
          <Clock3 size={16} />
          <span>{updated}</span>
        </div>
      </div>
    </motion.div>
  );
}
