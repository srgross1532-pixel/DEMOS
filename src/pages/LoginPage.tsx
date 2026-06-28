import { motion } from "framer-motion";
import BackgroundGlow from "../components/BackgroundGlow";
import LoginCard from "../components/LoginCard";
import Waveform from "../components/Waveform";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090D]">
      <BackgroundGlow />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="mb-12 flex flex-col items-center">
          <Waveform />

          <motion.h1
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.8,
            }}
            className="mt-6 text-7xl font-black tracking-[-0.06em] text-white"
          >
            DEMOS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-4 text-lg text-zinc-400"
          >
            Share music with your band.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.45,
            duration: 0.8,
          }}
        >
          <LoginCard />
        </motion.div>
      </motion.div>
    </main>
  );
}