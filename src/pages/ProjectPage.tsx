import { useRef } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { useSongs } from "../hooks/useSongs";
import { uploadSong } from "../services/songService";
import { formatSongTitle } from "../utils/formatSongTitle";

export default function ProjectPage() {
  const { id } = useParams();

  const { songs, loading } = useSongs(id ?? "");

  const inputRef = useRef<HTMLInputElement>(null);

  async function chooseFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !id) return;

    try {
      const title = formatSongTitle(file.name);

      await uploadSong(id, file, title);

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  }

  return (
    <main className="min-h-screen bg-[#08090D]">

      <div className="relative h-72 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700">

        <Link
          to="/projects"
          className="absolute left-6 top-14 rounded-full bg-black/20 p-3 backdrop-blur-xl"
        >
          <ArrowLeft className="text-white" />
        </Link>

        <div className="absolute bottom-8 left-8">

          <h1 className="text-5xl font-black text-white">
            Project
          </h1>

          <p className="mt-2 text-white/80">
            {songs.length} Songs
          </p>

        </div>

      </div>

      <div className="px-6 py-8">

        {loading ? (

          <p className="text-zinc-400">
            Loading...
          </p>

        ) : songs.length === 0 ? (

          <div className="mt-16 text-center">

            <h2 className="text-2xl font-bold text-white">
              No Songs Yet
            </h2>

            <p className="mt-3 text-zinc-500">
              Tap + to upload your first demo.
            </p>

          </div>

        ) : (

          <div className="space-y-2">

            {songs.map((song, index) => (

              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * .04 }}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/5 bg-[#141821] p-5 transition hover:bg-[#1A202B]"
              >

                <div>

                  <h3 className="text-lg font-semibold text-white">
                    {song.title}
                  </h3>

                  <p className="text-sm text-zinc-500">
                    Demo
                  </p>

                </div>

                <div className="text-blue-400">
                  ▶
                </div>

              </motion.div>

            ))}

          </div>

        )}

      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.wav,.m4a,.aac"
        hidden
        onChange={chooseFile}
      />

      <button
        onClick={() => inputRef.current?.click()}
        className="fixed bottom-10 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,.45)]"
      >
        <Plus className="text-white" />
      </button>

    </main>
  );
}