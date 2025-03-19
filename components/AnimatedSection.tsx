"use client"; // Обозначаем, что это клиентский компонент

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  variants?: {
    hidden: object;
    visible: object;
  };
  className?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
  className = "",
}) => {
  return (
    <motion.section
      variants={variants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.section>
  );
};

interface AnimatedDivProps {
  children: ReactNode;
  initial?: object;
  animate?: object;
  transition?: object;
  className?: string;
}

export const AnimatedDiv: React.FC<AnimatedDivProps> = ({
  children,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 0.5 },
  className = "",
}) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedTeamMemberProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedTeamMember: React.FC<AnimatedTeamMemberProps> = ({
  children,
  className = "",
}) => {
  const teamMemberVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } }, // Эффект при наведении
  };

  return (
    <motion.div
      variants={teamMemberVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={className}
    >
      {children}
    </motion.div>
  );
};
