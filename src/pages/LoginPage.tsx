import { motion } from "framer-motion";
import LoginCard from "../components/LoginCard";
import Waveform from "../components/Waveform";
import hero from "../assets/hero.png";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090D] px-6 py-10">
      <img
        src={hero}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-[#08090D]/75" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center gap-10 lg:flex-row lg:justify-between"
      >
        <div className="flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left">
          <Waveform />

          <motion.h1
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.8,
            }}
            className="mt-6 text-6xl font-black text-white sm:text-7xl"
          >
            DEMOS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-5 max-w-lg text-lg leading-8 text-zinc-300"
          >
            Unlimited power.
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
