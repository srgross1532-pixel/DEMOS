import { useRef } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { getProjectCoverUrl } from "../../services/projectService";
import type { Project } from "../../services/projectService";

type Props = {
  project: Project | null;
  songCount: number;
  onCoverSelected: (file: File) => Promise<void>;
};

export default function ProjectHeader({
  project,
  songCount,
  onCoverSelected,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.[0];

  console.log("Selected cover:", file);

  if (!file) return;

  console.log("Calling onCoverSelected...");

  await onCoverSelected(file);

  console.log("Finished onCoverSelected");

  e.target.value = "";
}

  const coverUrl =
    project?.cover_path
      ? getProjectCoverUrl(project.cover_path)
      : null;

  return (
    <div className="relative h-72 overflow-hidden">

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

      <div className="absolute inset-0 bg-black/35" />

      {/* Hidden Picker */}

      <input
  ref={inputRef}
  type="file"
  accept="image/*"
  className="hidden"
  onChange={(e) => {
    console.log("INPUT CHANGED");
    handleChange(e);
  }}
/>

      {/* Back */}

      <Link
        to="/projects"
        className="absolute left-6 top-14 z-20 rounded-full bg-black/30 p-3 backdrop-blur-xl"
      >
        <ArrowLeft className="text-white" />
      </Link>

      {/* Camera */}

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => {
            console.log("Camera clicked");
            inputRef.current?.click();
        }}
        className="absolute right-6 top-14 z-20 rounded-full bg-black/30 p-3 backdrop-blur-xl"
      >
        <Camera className="text-white" />
      </motion.button>

      {/* Title */}

      <div className="absolute bottom-8 left-8 z-20">

        <h1 className="text-5xl font-black text-white">
          {project?.name}
        </h1>

        <p className="mt-2 text-white/80">
          {songCount} Song
          {songCount !== 1 ? "s" : ""}
        </p>

      </div>

    </div>
  );
}