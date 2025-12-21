"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FireflyBackground } from "@/components/firefly-background";

export default function NotFound() {
  return (
    <div className="min-h-screen paper-texture relative flex items-center justify-center overflow-hidden">
      {/* Atmospheric Firefly Background */}
      <FireflyBackground />

      {/* Large Faint "404" Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[28rem] md:text-[36rem] font-serif font-bold text-muted opacity-[0.03] leading-none">
          404
        </span>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-2xl"
      >
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-8"
        >
          <FileQuestion
            className="w-20 h-20 text-accent/40"
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
          className="text-4xl md:text-5xl font-serif mb-6 text-foreground tracking-tight"
        >
          This page seems to be missing
          <br />
          from the archive
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.4,
          }}
          className="text-lg text-muted-foreground mb-10 max-w-md leading-relaxed"
        >
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to familiar ground.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
          }}
        >
          <Button asChild size="lg" className="font-medium">
            <Link href="/">Return Home</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
