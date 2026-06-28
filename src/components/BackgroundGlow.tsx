import { motion } from "framer-motion";

export default function BackgroundGlow() {
  return (
    <>
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-250px] top-[-250px] h-[520px] w-[520px] rounded-full bg-blue-500/20 blur-[150px]"
      />

      <motion.div
        animate={{
          x: [0, -35, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-180px] bottom-[-180px] h-[450px] w-[450px] rounded-full bg-cyan-400/15 blur-[150px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-blue-400/10 blur-[120px]"
      />
    </>
  );
}