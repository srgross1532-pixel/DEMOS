import { motion } from "framer-motion";
import {
  Music2,
  Users,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getProjectCoverUrl } from "../../services/projectService";

type Props = {
  id: string;
  title: string;
  songs: number;
  members: number;
  updated: string;
  colors: string;
  index: number;
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
      className="cursor-pointer overflow-hidden rounded-[30px] border border-white/10 bg-[#13171F] shadow-xl"
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

        <div className="absolute inset-0 bg-black/20" />
<button
  onClick={(e) => {
    e.stopPropagation();
    onDelete();
  }}
  className="absolute right-4 top-4 rounded-full bg-black/30 p-2 text-zinc-300 backdrop-blur transition hover:text-red-500"
>
  <Trash2 size={18} />
</button>

        <div className="absolute bottom-5 left-5">
          <h2 className="text-3xl font-black text-white">
            {title}
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-between p-6">
        <div className="flex gap-5 text-zinc-400">
          <div className="flex items-center gap-2">
            <Music2 size={18} />
            <span>{songs}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users size={18} />
            <span>{members}</span>
          </div>
        </div>

        <span className="text-sm font-medium text-blue-400">
          {updated}
        </span>
      </div>
    </motion.div>
  );
}