import { Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LoginCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="w-[420px] rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white">
          Welcome back
        </h2>

        <p className="mt-2 text-zinc-400">
          Sign in to access your projects
        </p>
      </div>

      <div className="space-y-5">

        <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <User className="mr-3 h-5 w-5 text-blue-400" />

          <input
            placeholder="Username"
            className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
          />
        </div>

        <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <Lock className="mr-3 h-5 w-5 text-blue-400" />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/projects")}
          className="mt-2 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,.45)]"
        >
          Sign In
        </motion.button>

      </div>
    </motion.div>
  );
}