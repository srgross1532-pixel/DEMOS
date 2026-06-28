import { ArrowLeft, MoreHorizontal, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const songs = [
  {
    title: "Dead End",
    duration: "3:42",
    updated: "Today",
  },
  {
    title: "Interstate",
    duration: "4:16",
    updated: "Yesterday",
  },
  {
    title: "Gravity",
    duration: "2:58",
    updated: "2 days ago",
  },
];

export default function ProjectPage() {
  return (
    <main className="min-h-screen bg-[#08090D] pb-32">
      <div className="h-72 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 relative">

        <Link
          to="/projects"
          className="absolute left-6 top-14 rounded-full bg-black/20 p-3 backdrop-blur-xl"
        >
          <ArrowLeft className="text-white" />
        </Link>

        <button className="absolute right-6 top-14 rounded-full bg-black/20 p-3 backdrop-blur-xl">
          <MoreHorizontal className="text-white" />
        </button>

        <div className="absolute bottom-8 left-8">
          <h1 className="text-5xl font-black text-white">
            INDID
          </h1>

          <p className="mt-2 text-white/80">
            1 Song • 3 Members
          </p>
        </div>

      </div>

      <div className="px-6 pt-8 space-y-4">

        {songs.map((song, i) => (
          <motion.div
            key={song.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-white/5 bg-[#141821] p-5"
          >
            <h2 className="text-2xl font-bold text-white">
              {song.title}
            </h2>

            <p className="mt-2 text-zinc-400">
              {song.duration}
            </p>

            <p className="mt-4 text-sm text-blue-400">
              Updated {song.updated}
            </p>
          </motion.div>
        ))}

      </div>

      <button className="fixed bottom-10 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_40px_rgba(59,130,246,.45)]">
        <Plus className="text-white" />
      </button>
    </main>
  );
}