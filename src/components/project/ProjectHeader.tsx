import { useRef } from "react";
import { ArrowLeft, Camera, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { getProjectCoverUrl } from "../../services/projectService";
import type { Project } from "../../services/projectService";

type Props = {
  project: Project | null;
  songCount: number;
  onCoverSelected: (file: File) => Promise<void>;
  onInvite: () => void;
};

export default function ProjectHeader({
  project,
  songCount,
  onCoverSelected,
  onInvite,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    await onCoverSelected(file);

    e.target.value = "";
  }

  const coverUrl =
    project?.cover_path
      ? getProjectCoverUrl(project.cover_path)
      : null;

  return (
    <div className="relative h-[22rem] overflow-hidden">

      {/* Background */}

      {coverUrl ? (
        <img
          src={coverUrl}
          alt={project?.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700" />
      )}

      {/* Overlay */}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-[#08090D]" />

      {/* Hidden Picker */}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {/* Back */}

      <Link
        to="/projects"
        className="absolute left-6 top-14 z-20 rounded-full bg-black/35 p-3 backdrop-blur-xl transition hover:bg-black/50"
        aria-label="Back to projects"
      >
        <ArrowLeft className="text-white" />
      </Link>

      <div className="absolute right-6 top-14 z-20 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={onInvite}
          className="flex items-center gap-2 rounded-full bg-black/35 px-4 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-black/50"
        >
          <UserPlus size={20} />
          Invite
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-black/35 p-3 backdrop-blur-xl transition hover:bg-black/50"
          aria-label="Change project artwork"
        >
          <Camera className="text-white" />
        </motion.button>
      </div>

      {/* Title */}

      <div className="absolute bottom-8 left-6 right-6 z-20 sm:left-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
        Project
        </p>

        <h1 className="mt-3 break-words text-5xl font-black text-white">
          {project?.name}
        </h1>

        <p className="mt-3 text-white/80">
          {songCount} Song
          {songCount !== 1 ? "s" : ""}
          {" "}ready for feedback
        </p>

      </div>

    </div>
  );
}
