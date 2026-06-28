import { motion } from "framer-motion";

const heights = [20, 34, 56, 82, 56, 34, 20];

export default function Waveform() {
  return (
    <div className="flex items-end justify-center gap-2 h-24">
      {heights.map((height, index) => (
        <motion.div
          key={index}
          animate={{
            height: [height, height + 16, height],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: index * 0.08,
            ease: "easeInOut",
          }}
          className="w-2 rounded-full bg-gradient-to-t from-blue-600 via-blue-400 to-cyan-300 shadow-[0_0_18px_rgba(59,130,246,.45)]"
          style={{ height }}
        />
      ))}
    </div>
  );
}