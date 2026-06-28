import { ArrowLeft, MessageCircle, Play, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SongPage() {
  return (
    <main className="min-h-screen bg-[#08090D] px-6 pb-12">

      <div className="pt-14 flex items-center justify-between">

        <Link
          to="/project/1"
          className="rounded-full bg-white/5 p-3 backdrop-blur-xl"
        >
          <ArrowLeft className="text-white" />
        </Link>

        <button className="rounded-full bg-white/5 p-3 backdrop-blur-xl">
          <Upload className="text-white" />
        </button>

      </div>

      <motion.div
        initial={{ opacity: 0, scale: .95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-10"
      >

        <div className="aspect-square rounded-[36px] bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 shadow-[0_0_60px_rgba(59,130,246,.35)]" />

      </motion.div>

      <h1 className="mt-8 text-5xl font-black text-white">
        Dead End
      </h1>

      <p className="mt-2 text-zinc-400">
        Working mix
      </p>

      <div className="mt-10">

        <div className="h-2 rounded-full bg-white/10">

          <div className="h-full w-1/3 rounded-full bg-blue-500" />

        </div>

        <div className="mt-2 flex justify-between text-sm text-zinc-500">
          <span>1:18</span>
          <span>3:42</span>
        </div>

      </div>

      <button className="mt-10 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-xl font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,.4)]">

        <Play fill="white" />

        Play

      </button>

      <section className="mt-12">

        <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-white">

          <MessageCircle />

          Comments

        </h2>

        <div className="space-y-4">

          <div className="rounded-3xl bg-[#141821] p-5">

            <h3 className="font-semibold text-white">
              Sam
            </h3>

            <p className="mt-2 text-zinc-400">
              Love the bridge. Let's bring the vocals up.
            </p>

          </div>

          <div className="rounded-3xl bg-[#141821] p-5">

            <h3 className="font-semibold text-white">
              Jake
            </h3>

            <p className="mt-2 text-zinc-400">
              Chorus hits hard.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}