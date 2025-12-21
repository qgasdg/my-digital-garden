"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ArticleWrapperProps {
  children: ReactNode;
}

export function ArticleWrapper({ children }: ArticleWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth motion
      }}
    >
      {children}
    </motion.div>
  );
}
