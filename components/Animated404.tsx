// components/Animated404.tsx
"use client";

import { FileX2, Search, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export const Animated404 = () => {
  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    float: (delay: number) => ({
      opacity: 1,
      scale: 1,
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 2, repeat: Infinity, ease: "easeInOut", delay },
      },
    }),
  };

  return (
    <div className="relative flex justify-center items-center h-[200px] sm:h-[300px] mb-6">
      <motion.div
        variants={iconVariants}
        initial="hidden"
        animate={iconVariants.float(0)}
        className="absolute"
        style={{ left: "20%" }}
      >
        <FileX2 size={60} className="text-gray-400" />
      </motion.div>

      <motion.div
        variants={iconVariants}
        initial="hidden"
        animate={iconVariants.float(0.3)}
        className="absolute"
        style={{ left: "40%" }}
      >
        <Search size={80} className="text-gray-500" />
      </motion.div>

      <motion.div
        variants={iconVariants}
        initial="hidden"
        animate={iconVariants.float(0.6)}
        className="absolute"
        style={{ left: "60%" }}
      >
        <HelpCircle size={60} className="text-gray-400" />
      </motion.div>
    </div>
  );
};
