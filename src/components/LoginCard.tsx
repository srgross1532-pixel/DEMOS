import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";

export default function LoginCard() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        alert(
          "Account created!\n\nYou can now sign in."
        );

        setIsRegister(false);
      } else {
        const { error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) throw error;

        navigate("/projects");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[420px] rounded-lg border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-3xl sm:p-8"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white">
          {isRegister
            ? "Create account"
            : "Welcome back"}
        </h2>

        <p className="mt-2 text-zinc-400">
          {isRegister
            ? "Create your DEMOS account"
            : "Sign in to your band projects"}
        </p>
      </div>

      <div className="space-y-5">

        <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-4 py-4">
          <Mail className="mr-3 h-5 w-5 text-blue-400" />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
          />
        </div>

        <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-4 py-4">
          <Lock className="mr-3 h-5 w-5 text-blue-400" />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={handleSubmit}
          className="mt-2 w-full rounded-lg bg-blue-500 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,.45)] transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : isRegister
            ? "Create Account"
            : "Sign In"}
        </motion.button>

        <button
          onClick={() =>
            setIsRegister(!isRegister)
          }
          className="w-full text-center text-sm text-zinc-400 hover:text-white"
        >
          {isRegister
            ? "Already have an account? Sign In"
            : "Don't have an account? Create one"}
        </button>

      </div>
    </motion.div>
  );
}
